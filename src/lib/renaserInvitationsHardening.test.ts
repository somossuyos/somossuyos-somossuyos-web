import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createInMemoryCheckoutOrdersRepository } from './orders/checkoutOrdersRepository';
import { RENSER_CANONICAL_PRODUCT_ID } from './orders/renaserCheckout';
import type { CheckoutOrder } from './orders/types';
import { normalizeInvitationEmail } from './renaserInvitations/email';
import { generateInvitationToken, hashInvitationToken } from './renaserInvitations/token';
import { createInMemoryInvitationsRepository } from './renaserInvitations/repository';
import {
  consumeInvitationOnApprovedPayment,
} from './renaserInvitations/webhookInvitation';

function baseOrder(overrides: Partial<CheckoutOrder> = {}): CheckoutOrder {
  return {
    reference: 'ss-renaser-a',
    productId: RENSER_CANONICAL_PRODUCT_ID,
    productSlug: 'memorias-en-video-del-congreso',
    firstName: 'A',
    lastName: 'B',
    email: 'buyer@example.com',
    phone: '1',
    amountInCents: 25000000,
    currency: 'COP',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    provisioningStatus: 'NOT_STARTED',
    ...overrides,
  };
}

describe('RenaSER invitation hardening', () => {
  it('1. two tokens same email → only one invitation', async () => {
    const repo = createInMemoryInvitationsRepository();
    const email = 'same@example.com';
    const [a, b] = await Promise.all([
      repo.putInvitationIfNotExists({
        tokenHash: hashInvitationToken(generateInvitationToken()),
        emailNormalized: email,
        firstName: 'A',
        lastName: '1',
      }),
      repo.putInvitationIfNotExists({
        tokenHash: hashInvitationToken(generateInvitationToken()),
        emailNormalized: email,
        firstName: 'B',
        lastName: '2',
      }),
    ]);
    assert.equal([a, b].filter((x) => x === 'created').length, 1);
    assert.equal([a, b].filter((x) => x === 'exists').length, 1);
    assert.equal(repo.byEmail.size, 1);
  });

  it('2. repeated import same email → EXISTING', async () => {
    const repo = createInMemoryInvitationsRepository();
    const input = {
      tokenHash: hashInvitationToken(generateInvitationToken()),
      emailNormalized: 'repeat@example.com',
      firstName: 'R',
      lastName: 'E',
    };
    assert.equal(await repo.putInvitationIfNotExists(input), 'created');
    assert.equal(await repo.putInvitationIfNotExists(input), 'exists');
  });

  it('3. concurrent import same email → one CREATED', async () => {
    const repo = createInMemoryInvitationsRepository();
    const email = 'concurrent@example.com';
    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        repo.putInvitationIfNotExists({
          tokenHash: hashInvitationToken(generateInvitationToken()),
          emailNormalized: email,
          firstName: 'C',
          lastName: 'O',
        }),
      ),
    );
    assert.equal(results.filter((r) => r === 'created').length, 1);
    assert.equal(results.filter((r) => r === 'exists').length, 4);
  });

  it('8. email normalization collapses variants', async () => {
    const repo = createInMemoryInvitationsRepository();
    assert.equal(
      await repo.putInvitationIfNotExists({
        tokenHash: hashInvitationToken(generateInvitationToken()),
        emailNormalized: '  GMAIL@Example.COM ',
        firstName: 'G',
        lastName: 'M',
      }),
      'created',
    );
    assert.equal(
      await repo.putInvitationIfNotExists({
        tokenHash: hashInvitationToken(generateInvitationToken()),
        emailNormalized: 'gmail@example.com',
        firstName: 'X',
        lastName: 'Y',
      }),
      'exists',
    );
    assert.equal(normalizeInvitationEmail('GMAIL@example.com'), 'gmail@example.com');
  });

  it('4. expired reservation + order A PENDING blocks order B', async () => {
    const orders = createInMemoryCheckoutOrdersRepository();
    await orders.putPendingCheckoutOrder(baseOrder({ reference: 'ss-renaser-a' }));
    const repo = createInMemoryInvitationsRepository({
      lookupCheckoutOrder: (ref) => orders.getCheckoutOrderByReference(ref),
    });
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'late@example.com',
      firstName: 'L',
      lastName: 'P',
    });
    await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-a');
    const inv = (await repo.getInvitationByTokenHash(hash))!;
    inv.reservationExpiresAt = new Date(Date.now() - 60_000).toISOString();

    const b = await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-b');
    assert.equal(b.ok, false);
    if (!b.ok) assert.equal(b.reason, 'pending_previous_order');
  });

  it('5. late APPROVED order A consumes when still bound', async () => {
    const orders = createInMemoryCheckoutOrdersRepository();
    const repo = createInMemoryInvitationsRepository({
      lookupCheckoutOrder: (ref) => orders.getCheckoutOrderByReference(ref),
    });
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'lateok@example.com',
      firstName: 'L',
      lastName: 'O',
    });
    await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-a');
    await orders.putPendingCheckoutOrder(
      baseOrder({ reference: 'ss-renaser-a', email: 'lateok@example.com', invitationTokenHash: hash }),
    );
    const inv = (await repo.getInvitationByTokenHash(hash))!;
    inv.reservationExpiresAt = new Date(Date.now() - 120_000).toISOString();

    const consume = await repo.markInvitationPurchasedIdempotent(
      hash,
      'ss-renaser-a',
      'trx-late-a',
      'lateok@example.com',
    );
    assert.equal(consume.ok, true);
    assert.equal((await repo.getInvitationByTokenHash(hash))?.status, 'PURCHASED');
  });

  it('6. order B APPROVED after A PURCHASED → no second consume / no provision', async () => {
    process.env.RENASER_INVITATIONS_ENFORCE = 'true';
    const orders = createInMemoryCheckoutOrdersRepository();
    const invRepo = createInMemoryInvitationsRepository({
      lookupCheckoutOrder: (ref) => orders.getCheckoutOrderByReference(ref),
    });
    const hash = hashInvitationToken(generateInvitationToken());
    await invRepo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'double@example.com',
      firstName: 'D',
      lastName: 'B',
    });
    await invRepo.tryReserveInvitationForCheckout(hash, 'ss-renaser-a');
    await orders.putPendingCheckoutOrder(
      baseOrder({ reference: 'ss-renaser-a', email: 'double@example.com', invitationTokenHash: hash }),
    );
    await invRepo.markInvitationPurchasedIdempotent(hash, 'ss-renaser-a', 'trx-a', 'double@example.com');

    await orders.putPendingCheckoutOrder(
      baseOrder({ reference: 'ss-renaser-b', email: 'double@example.com', invitationTokenHash: hash }),
    );

    const consumeB = await invRepo.markInvitationPurchasedIdempotent(
      hash,
      'ss-renaser-b',
      'trx-b',
      'double@example.com',
    );
    assert.equal(consumeB.ok, false);

    const webhookConsume = await consumeInvitationOnApprovedPayment(
      (await orders.getCheckoutOrderByReference('ss-renaser-b'))!,
      'trx-b',
      invRepo,
    );
    assert.equal(webhookConsume.ok, false);
    assert.equal((await invRepo.getInvitationByTokenHash(hash))?.orderReference, 'ss-renaser-a');
  });

  it('7. concurrent APPROVED different orders → one PURCHASED one blocked', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'racepay@example.com',
      firstName: 'R',
      lastName: 'P',
    });
    await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-a');

    const [c1, c2] = await Promise.all([
      repo.markInvitationPurchasedIdempotent(hash, 'ss-renaser-a', 'trx-1', 'racepay@example.com'),
      repo.markInvitationPurchasedIdempotent(hash, 'ss-renaser-b', 'trx-2', 'racepay@example.com'),
    ]);
    const okCount = [c1, c2].filter((c) => c.ok).length;
    assert.equal(okCount, 1);
    assert.equal((await repo.getInvitationByTokenHash(hash))?.status, 'PURCHASED');
    assert.equal((await repo.getInvitationByTokenHash(hash))?.orderReference, 'ss-renaser-a');
  });
});
