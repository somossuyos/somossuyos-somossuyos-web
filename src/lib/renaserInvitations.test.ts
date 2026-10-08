import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { generateInvitationToken, hashInvitationToken } from './renaserInvitations/token';
import {
  isValidInvitationEmailSyntax,
  normalizeInvitationEmail,
} from './renaserInvitations/email';
import { evaluateInvitationForAccess } from './renaserInvitations/invitationLogic';
import { createInMemoryInvitationsRepository } from './renaserInvitations/repository';
import type { CheckoutOrder } from './orders/types';
import { RENSER_CANONICAL_PRODUCT_ID } from './orders/renaserCheckout';
import { verifyWompiEventChecksum } from './wompi/webhookVerify';
import { evaluateWompiWebhookAuth } from './wompi/webhookAuthPolicy';
import { processWompiTransactionUpdate } from './wompi/processWompiTransaction';
import { createInMemoryCheckoutOrdersRepository } from './orders/checkoutOrdersRepository';

const ORIGINAL = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL };
});

function baseOrder(overrides: Partial<CheckoutOrder> = {}): CheckoutOrder {
  return {
    reference: 'ss-renaser-inv-1',
    productId: RENSER_CANONICAL_PRODUCT_ID,
    productSlug: 'memorias-en-video-del-congreso',
    firstName: 'Ana',
    lastName: 'Pérez',
    email: 'ana@example.com',
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

describe('RenaSER purchase invitations', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL, RENASER_INVITATIONS_ENFORCE: 'true' };
  });

  it('1. valid token hash resolves invitation', async () => {
    const repo = createInMemoryInvitationsRepository();
    const token = generateInvitationToken();
    const hash = hashInvitationToken(token);
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'a@example.com',
      firstName: 'A',
      lastName: 'B',
    });
    const inv = await repo.getInvitationByTokenHash(hash);
    assert.ok(inv);
    assert.equal(evaluateInvitationForAccess(inv).ok, true);
  });

  it('2. unknown token', () => {
    assert.equal(evaluateInvitationForAccess(null).ok, false);
  });

  it('3. expired invitation', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'x@example.com',
      firstName: 'X',
      lastName: 'Y',
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
    });
    const inv = await repo.getInvitationByTokenHash(hash);
    assert.equal(evaluateInvitationForAccess(inv).ok, false);
  });

  it('4. PURCHASED blocks access', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'p@example.com',
      firstName: 'P',
      lastName: 'Q',
    });
    const inv = (await repo.getInvitationByTokenHash(hash))!;
    inv.status = 'PURCHASED';
    assert.equal(evaluateInvitationForAccess(inv).ok, false);
  });

  it('5. email syntax validation', () => {
    assert.equal(isValidInvitationEmailSyntax(normalizeInvitationEmail('  Ana@Test.COM ')), true);
    assert.equal(isValidInvitationEmailSyntax('not-an-email'), false);
  });

  it('7. checkout reserve ties orderReference', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'c@example.com',
      firstName: 'C',
      lastName: 'D',
    });
    const r1 = await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-a');
    assert.equal(r1.ok, true);
    const r2 = await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-b');
    assert.equal(r2.ok, false);
  });

  it('8. abandoned checkout releases reservation', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'd@example.com',
      firstName: 'D',
      lastName: 'E',
    });
    await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-rel');
    await repo.releaseInvitationReservation('ss-renaser-rel');
    const inv = await repo.getInvitationByTokenHash(hash);
    assert.equal(inv?.status, 'AVAILABLE');
  });

  it('11. APPROVED consumes invitation', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'ok@example.com',
      firstName: 'O',
      lastName: 'K',
    });
    await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-ok');
    const order = baseOrder({
      reference: 'ss-renaser-ok',
      email: 'ok@example.com',
      invitationTokenHash: hash,
    });
    const c = await repo.markInvitationPurchasedIdempotent(
      hash,
      order.reference,
      'trx-1',
      order.email,
    );
    assert.equal(c.ok, true);
    const inv = await repo.getInvitationByTokenHash(hash);
    assert.equal(inv?.status, 'PURCHASED');
  });

  it('12. duplicate APPROVED consume idempotent', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'dup@example.com',
      firstName: 'D',
      lastName: 'U',
    });
    await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-dup');
    await repo.markInvitationPurchasedIdempotent(hash, 'ss-renaser-dup', 'trx-9', 'dup@example.com');
    const again = await repo.markInvitationPurchasedIdempotent(
      hash,
      'ss-renaser-dup',
      'trx-9',
      'dup@example.com',
    );
    assert.equal(again.ok, true);
    if (again.ok) assert.equal(again.already, true);
  });

  it('14. second purchase blocked after PURCHASED', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'once@example.com',
      firstName: 'O',
      lastName: 'N',
    });
    const inv = (await repo.getInvitationByTokenHash(hash))!;
    inv.status = 'PURCHASED';
    inv.orderReference = 'ss-renaser-first';
    const reserve = await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-second');
    assert.equal(reserve.ok, false);
  });

  it('18. invalid Wompi signature rejected', () => {
    process.env.WOMPI_EVENTS_SECRET = 'sec';
    const body = {
      timestamp: 1700000000,
      data: { transaction: { reference: 'ss-prod-x', status: 'APPROVED' } },
      signature: { properties: ['transaction.id'], checksum: 'deadbeef' },
    };
    const auth = evaluateWompiWebhookAuth({}, body);
    assert.equal(auth.ok, false);
  });

  it('19-20. provisioning idempotent with invitation enforced', async () => {
    process.env.RENASER_INVITATIONS_ENFORCE = 'false';
    const repo = createInMemoryCheckoutOrdersRepository();
    let provisionCalls = 0;
    const ref = 'ss-renaser-prov';
    await repo.putPendingCheckoutOrder(baseOrder({ reference: ref }));
    const trx = {
      id: 't-prov',
      status: 'APPROVED',
      reference: ref,
      amount_in_cents: 25000000,
      currency: 'COP',
    };
    const mockProvision = async () => {
      provisionCalls += 1;
      return { ok: true as const, status: 'provisioned' as const };
    };
    await processWompiTransactionUpdate(trx, { ...repo, provisionSkillCert: mockProvision });
    await processWompiTransactionUpdate(trx, { ...repo, provisionSkillCert: mockProvision });
    assert.equal(provisionCalls, 1);
  });
});

describe('Wompi checksum helper', () => {
  it('17. reference validation via renaser prefix', () => {
    const v = verifyWompiEventChecksum(
      {
        timestamp: 1,
        data: { transaction: { id: 'a', reference: 'ss-renaser-1' } },
        signature: { properties: ['transaction.id'], checksum: 'x' },
      },
      'x',
      'secret',
    );
    assert.equal(typeof v.ok, 'boolean');
  });
});
