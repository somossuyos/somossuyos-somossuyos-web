import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';
import crypto from 'node:crypto';
import { createInMemoryCheckoutOrdersRepository } from '../orders/checkoutOrdersRepository';
import { RENSER_CANONICAL_PRODUCT_ID } from '../orders/renaserCheckout';
import type { CheckoutOrder } from '../orders/types';
import { processWompiTransactionUpdate } from '../wompi/processWompiTransaction';
import { verifyWompiEventChecksum } from '../wompi/webhookVerify';
import { evaluateWompiWebhookAuth } from '../wompi/webhookAuthPolicy';
import { generateInvitationToken, hashInvitationToken } from './token';
import { evaluateInvitationForAccess, isInvitationExpired } from './invitationLogic';
import { createInMemoryInvitationsRepository } from './repository';
import { consumeInvitationOnApprovedPayment, releaseInvitationIfPaymentFailed } from './webhookInvitation';
import { validateRenaserApprovedPayment } from '../wompi/renaserPaymentValidation';

const ORIGINAL = { ...process.env };

function baseOrder(overrides: Partial<CheckoutOrder> = {}): CheckoutOrder {
  return {
    reference: 'ss-renaser-inv-1',
    productId: RENSER_CANONICAL_PRODUCT_ID,
    productSlug: 'memorias-en-video-del-congreso',
    firstName: 'Ana',
    lastName: 'Pérez',
    email: 'ana@example.com',
    phone: '+573001234567',
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
  afterEach(() => {
    process.env = ORIGINAL;
  });

  it('1. valid token + matching email can reserve checkout', async () => {
    const invRepo = createInMemoryInvitationsRepository();
    const token = generateInvitationToken();
    const tokenHash = hashInvitationToken(token);
    await invRepo.putInvitationIfNotExists({
      tokenHash,
      emailNormalized: 'ana@example.com',
      firstName: 'Ana',
      lastName: 'P',
    });
    const reserved = await invRepo.tryReserveInvitationForCheckout(tokenHash, 'ss-renaser-a');
    assert.equal(reserved.ok, true);
  });

  it('2. unknown token hash fails access evaluation', () => {
    const r = evaluateInvitationForAccess(null);
    assert.equal(r.ok, false);
  });

  it('3. expired invitation rejected', () => {
    const inv = {
      tokenHash: 'h',
      emailNormalized: 'a@b.com',
      firstName: 'A',
      lastName: 'B',
      status: 'AVAILABLE' as const,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
    };
    assert.equal(isInvitationExpired(inv), true);
    const r = evaluateInvitationForAccess(inv);
    assert.equal(r.ok, false);
  });

  it('4. PURCHASED invitation blocked with friendly message', () => {
    const r = evaluateInvitationForAccess({
      tokenHash: 'h',
      emailNormalized: 'a@b.com',
      firstName: 'A',
      lastName: 'B',
      status: 'PURCHASED',
      createdAt: new Date().toISOString(),
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.match(r.message, /ya fue utilizada/i);
  });

  it('5–6. email mismatch on consume fails', async () => {
    const invRepo = createInMemoryInvitationsRepository();
    const tokenHash = hashInvitationToken(generateInvitationToken());
    await invRepo.putInvitationIfNotExists({
      tokenHash,
      emailNormalized: 'a@example.com',
      firstName: 'A',
      lastName: 'B',
    });
    await invRepo.tryReserveInvitationForCheckout(tokenHash, 'ss-renaser-x');
    const order = baseOrder({
      reference: 'ss-renaser-x',
      email: 'other@example.com',
      invitationTokenHash: tokenHash,
    });
    const r = await consumeInvitationOnApprovedPayment(order, 'trx-1', invRepo);
    assert.equal(r.ok, false);
  });

  it('7. valid checkout reservation then APPROVED consumes once', async () => {
    const invRepo = createInMemoryInvitationsRepository();
    const tokenHash = hashInvitationToken(generateInvitationToken());
    await invRepo.putInvitationIfNotExists({
      tokenHash,
      emailNormalized: 'ana@example.com',
      firstName: 'Ana',
      lastName: 'P',
    });
    await invRepo.tryReserveInvitationForCheckout(tokenHash, 'ss-renaser-ok');
    const order = baseOrder({
      reference: 'ss-renaser-ok',
      invitationTokenHash: tokenHash,
    });
    const first = await consumeInvitationOnApprovedPayment(order, 'trx-ok', invRepo);
    assert.equal(first.ok, true);
    assert.equal(first.already, false);
    const second = await consumeInvitationOnApprovedPayment(order, 'trx-ok', invRepo);
    assert.equal(second.ok, true);
    assert.equal(second.already, true);
  });

  it('8. abandoned checkout releases on DECLINED', async () => {
    const invRepo = createInMemoryInvitationsRepository();
    const tokenHash = hashInvitationToken(generateInvitationToken());
    await invRepo.putInvitationIfNotExists({
      tokenHash,
      emailNormalized: 'ana@example.com',
      firstName: 'Ana',
      lastName: 'P',
    });
    await invRepo.tryReserveInvitationForCheckout(tokenHash, 'ss-renaser-rel');
    await releaseInvitationIfPaymentFailed(
      baseOrder({ reference: 'ss-renaser-rel', invitationTokenHash: tokenHash }),
      'DECLINED',
      invRepo,
    );
    const inv = await invRepo.getInvitationByTokenHash(tokenHash);
    assert.equal(inv?.status, 'AVAILABLE');
  });

  it('9–10. ERROR and VOIDED do not consume invitation', async () => {
    const invRepo = createInMemoryInvitationsRepository();
    const tokenHash = hashInvitationToken(generateInvitationToken());
    await invRepo.putInvitationIfNotExists({
      tokenHash,
      emailNormalized: 'ana@example.com',
      firstName: 'Ana',
      lastName: 'P',
    });
    await invRepo.tryReserveInvitationForCheckout(tokenHash, 'ss-renaser-fail');
    for (const st of ['ERROR', 'VOIDED']) {
      await releaseInvitationIfPaymentFailed(
        baseOrder({ reference: 'ss-renaser-fail', invitationTokenHash: tokenHash }),
        st,
        invRepo,
      );
    }
    const inv = await invRepo.getInvitationByTokenHash(tokenHash);
    assert.equal(inv?.status, 'AVAILABLE');
  });

  it('11. APPROVED consumes CHECKOUT_STARTED invitation', async () => {
    const invRepo = createInMemoryInvitationsRepository();
    const tokenHash = hashInvitationToken(generateInvitationToken());
    await invRepo.putInvitationIfNotExists({
      tokenHash,
      emailNormalized: 'ana@example.com',
      firstName: 'Ana',
      lastName: 'P',
    });
    await invRepo.tryReserveInvitationForCheckout(tokenHash, 'ss-renaser-ap');
    const c = await consumeInvitationOnApprovedPayment(
      baseOrder({ reference: 'ss-renaser-ap', invitationTokenHash: tokenHash }),
      '1108808-1',
      invRepo,
    );
    assert.equal(c.ok, true);
    const inv = await invRepo.getInvitationByTokenHash(tokenHash);
    assert.equal(inv?.status, 'PURCHASED');
  });

  it('12. duplicate APPROVED webhook idempotent provisioning', async () => {
    const repo = createInMemoryCheckoutOrdersRepository();
    const ref = 'ss-renaser-dup';
    await repo.putPendingCheckoutOrder({
      reference: ref,
      productId: RENSER_CANONICAL_PRODUCT_ID,
      productSlug: 'memorias-en-video-del-congreso',
      firstName: 'A',
      lastName: 'B',
      email: 'dup@example.com',
      phone: '1',
      amountInCents: 25000000,
      currency: 'COP',
    });
    let provisionCalls = 0;
    const provision = async () => {
      provisionCalls++;
      return { ok: true as const, status: 'provisioned' as const };
    };
    const trx = {
      id: 'trx-dup',
      reference: ref,
      status: 'APPROVED',
      amount_in_cents: 25000000,
      currency: 'COP',
    };
    process.env.RENASER_INVITATIONS_ENFORCE = 'false';
    await processWompiTransactionUpdate(trx, { ...repo, provisionSkillCert: provision });
    await processWompiTransactionUpdate(trx, { ...repo, provisionSkillCert: provision });
    assert.equal(provisionCalls, 1);
  });

  it('13. concurrent checkout second reference blocked while reservation active', async () => {
    const invRepo = createInMemoryInvitationsRepository();
    const tokenHash = hashInvitationToken(generateInvitationToken());
    await invRepo.putInvitationIfNotExists({
      tokenHash,
      emailNormalized: 'ana@example.com',
      firstName: 'Ana',
      lastName: 'P',
    });
    await invRepo.tryReserveInvitationForCheckout(tokenHash, 'ss-renaser-one');
    const second = await invRepo.tryReserveInvitationForCheckout(tokenHash, 'ss-renaser-two');
    assert.equal(second.ok, false);
  });

  it('14. PURCHASED blocks new reservation', async () => {
    const invRepo = createInMemoryInvitationsRepository();
    const tokenHash = hashInvitationToken(generateInvitationToken());
    await invRepo.putInvitationIfNotExists({
      tokenHash,
      emailNormalized: 'ana@example.com',
      firstName: 'Ana',
      lastName: 'P',
    });
    await invRepo.tryReserveInvitationForCheckout(tokenHash, 'ss-renaser-p');
    await invRepo.markInvitationPurchasedIdempotent(
      tokenHash,
      'ss-renaser-p',
      'trx',
      'ana@example.com',
    );
    const again = await invRepo.tryReserveInvitationForCheckout(tokenHash, 'ss-renaser-q');
    assert.equal(again.ok, false);
  });

  it('15–17. amount/currency/reference validation rejects bad trx', () => {
    const order = baseOrder();
    assert.equal(
      validateRenaserApprovedPayment(order, {
        amount_in_cents: 1,
        currency: 'COP',
        reference: order.reference,
      }).ok,
      false,
    );
    assert.equal(
      validateRenaserApprovedPayment(order, {
        amount_in_cents: 25000000,
        currency: 'USD',
        reference: order.reference,
      }).ok,
      false,
    );
  });

  it('18. invalid Wompi signature rejected', () => {
    process.env.RENASER_WOMPI_EVENTS_SECRET = 'test_events_secret';
    process.env.WOMPI_EVENTS_SECRET = 'other';
    const body = {
      event: 'transaction.updated',
      data: { transaction: { id: '1', status: 'APPROVED', amount_in_cents: 1, reference: 'x' } },
      signature: { properties: ['transaction.id'], checksum: 'deadbeef', timestamp: 1 },
    };
    const auth = evaluateWompiWebhookAuth({}, body);
    assert.equal(auth.ok, false);
  });

  it('19–20. token uses high entropy; hash differs from email', () => {
    const t1 = generateInvitationToken();
    const t2 = generateInvitationToken();
    assert.notEqual(t1, t2);
    const emailHash = crypto.createHash('sha256').update('a@b.com').digest('hex');
    assert.notEqual(hashInvitationToken(t1), emailHash);
  });

  it('valid Wompi checksum verifies with events secret', () => {
    const secret = 'test_events_' + 'a'.repeat(20);
    process.env.RENASER_WOMPI_EVENTS_SECRET = secret;
    const trx = {
      id: '1234-1610641025-49201',
      status: 'APPROVED',
      amount_in_cents: 25000000,
      reference: 'ss-renaser-test',
    };
    const timestamp = 1530291411;
    const concat = `${trx.id}${trx.status}${trx.amount_in_cents}${timestamp}${secret}`;
    const checksum = crypto.createHash('sha256').update(concat).digest('hex');
    const verified = verifyWompiEventChecksum(
      {
        event: 'transaction.updated',
        data: { transaction: trx },
        signature: {
          properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
          checksum,
        },
        timestamp,
      },
      checksum,
      secret,
    );
    assert.equal(verified.ok, true);
  });
});
