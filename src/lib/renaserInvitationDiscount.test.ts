import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';
import {
  calculateRenaserInvitationPricing,
  validateRenaserInvitedClientTotalPrice,
} from './renaserInvitations/pricing';
import {
  buildRenaserPendingOrderFields,
  validateRenaserClientTotalPrice,
} from './orders/renaserCheckout';
import { validateRenaserApprovedPayment } from './wompi/renaserPaymentValidation';
import type { CheckoutOrder } from './orders/types';
import { RENSER_CANONICAL_PRODUCT_ID } from './orders/renaserCheckout';
import {
  buildPurchaseInvitationEmail,
  PURCHASE_INVITATION_CTA_LABEL,
  PURCHASE_INVITATION_SUBJECT,
} from './renaserInvitations/invitation-email-template';
import { createInMemoryInvitationsRepository } from './renaserInvitations/repository';
import { hashInvitationToken, generateInvitationToken } from './renaserInvitations/token';
import { releaseInvitationIfPaymentFailed } from './renaserInvitations/webhookInvitation';
import { assertRenaserInvitationCheckout } from './renaserInvitations/checkoutGuard';
import type { NextApiRequest } from 'next';
import { formatPrice } from '../utils/formatPrice';

const ORIGINAL = { ...process.env };

function order(overrides: Partial<CheckoutOrder> = {}): CheckoutOrder {
  const pricing = calculateRenaserInvitationPricing();
  return {
    reference: 'ss-renaser-disc',
    productId: RENSER_CANONICAL_PRODUCT_ID,
    productSlug: 'memorias-en-video-del-congreso',
    firstName: 'A',
    lastName: 'B',
    email: 'inv@example.com',
    phone: '1',
    amountInCents: pricing.finalAmountInCents,
    baseAmountInCents: pricing.baseAmountInCents,
    discountPercent: pricing.discountPercent,
    discountAmountInCents: pricing.discountAmountInCents,
    currency: 'COP',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    provisioningStatus: 'NOT_STARTED',
    invitationTokenHash: 'hash',
    invitationEmailNormalized: 'inv@example.com',
    ...overrides,
  };
}

describe('RenaSER invitation invited price 150000 COP', () => {
  beforeEach(() => {
    process.env.RENASER_INVITATIONS_ENFORCE = 'true';
  });
  afterEach(() => {
    process.env = { ...ORIGINAL };
  });

  it('1. backend pricing final = 150000 COP', () => {
    const p = calculateRenaserInvitationPricing();
    assert.equal(p.basePriceCop, 250000);
    assert.equal(p.discountAmountCop, 100000);
    assert.equal(p.discountPercent, 40);
    assert.equal(p.finalPriceCop, 150000);
    assert.equal(p.finalAmountInCents, 15000000);
    assert.equal(p.baseAmountInCents, 25000000);
    assert.equal(p.discountAmountInCents, 10000000);
  });

  it('2. amountInCents for Wompi = 15000000', () => {
    const p = calculateRenaserInvitationPricing();
    assert.equal(p.finalAmountInCents, 15000000);
  });

  it('3. frontend sends 100000 COP → rejected', () => {
    assert.equal(validateRenaserInvitedClientTotalPrice(100000), false);
    assert.equal(validateRenaserClientTotalPrice(100000), false);
  });

  it('4. frontend sends 250000 COP → rejected for invited checkout', () => {
    assert.equal(validateRenaserInvitedClientTotalPrice(250000), false);
    assert.equal(validateRenaserClientTotalPrice(250000), false);
  });

  it('5. webhook 15000000 → PASS', () => {
    const o = order();
    const r = validateRenaserApprovedPayment(o, {
      status: 'APPROVED',
      amount_in_cents: 15000000,
      currency: 'COP',
    });
    assert.equal(r.ok, true);
  });

  it('6. webhook 10000000 → FAIL', () => {
    const o = order();
    const r = validateRenaserApprovedPayment(o, {
      status: 'APPROVED',
      amount_in_cents: 10000000,
      currency: 'COP',
    });
    assert.equal(r.ok, false);
  });

  it('7. webhook 25000000 → FAIL for invited order', () => {
    const o = order();
    const r = validateRenaserApprovedPayment(o, {
      status: 'APPROVED',
      amount_in_cents: 25000000,
      currency: 'COP',
    });
    assert.equal(r.ok, false);
  });

  it('8. DECLINED does not consume invitation', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'd@example.com',
      firstName: 'D',
      lastName: 'E',
    });
    await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-d');
    await releaseInvitationIfPaymentFailed(
      order({ reference: 'ss-renaser-d', invitationTokenHash: hash, email: 'd@example.com' }),
      'DECLINED',
      repo,
    );
    await repo.releaseInvitationReservation('ss-renaser-d');
    assert.equal((await repo.getInvitationByTokenHash(hash))?.status, 'AVAILABLE');
  });

  it('9. APPROVED consumes invitation', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'ok@example.com',
      firstName: 'O',
      lastName: 'K',
    });
    await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-ok');
    const c = await repo.markInvitationPurchasedIdempotent(
      hash,
      'ss-renaser-ok',
      'trx',
      'ok@example.com',
    );
    assert.equal(c.ok, true);
  });

  it('10. duplicate APPROVED idempotent', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'dup@example.com',
      firstName: 'D',
      lastName: 'U',
    });
    await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-dup');
    await repo.markInvitationPurchasedIdempotent(hash, 'ss-renaser-dup', 't1', 'dup@example.com');
    const again = await repo.markInvitationPurchasedIdempotent(
      hash,
      'ss-renaser-dup',
      't1',
      'dup@example.com',
    );
    assert.equal(again.ok, true);
  });

  it('11. email template contains 150.000 COP', () => {
    const email = buildPurchaseInvitationEmail({ firstName: 'Ana', token: 'test-token-value' });
    assert.match(email.text, /150\.000 COP/);
    assert.match(email.html, /150\.000 COP/);
  });

  it('12. email template does not mention 60% discount', () => {
    const email = buildPurchaseInvitationEmail({ firstName: 'Ana', token: 'test-token-value' });
    assert.doesNotMatch(email.text, /60\s*%/);
    assert.doesNotMatch(email.html, /60\s*%/);
    assert.equal(PURCHASE_INVITATION_SUBJECT, 'Memorias del Congreso RenaSER 2026');
    assert.match(email.html, new RegExp(PURCHASE_INVITATION_CTA_LABEL));
    assert.doesNotMatch(email.text, /test-token-value/);
  });

  it('13. checkout copy amounts 250k → -100k → 150k', () => {
    const p = calculateRenaserInvitationPricing();
    assert.match(formatPrice(p.basePriceCop), /250\.?000/);
    assert.match(formatPrice(p.discountAmountCop), /100\.?000/);
    assert.match(formatPrice(p.finalPriceCop), /150\.?000/);
  });

  it('15. order fields store discount metadata', () => {
    const p = calculateRenaserInvitationPricing();
    const fields = buildRenaserPendingOrderFields(
      {
        names: 'A',
        lastNames: 'B',
        email: 'a@b.com',
        phone: '1',
        direction: {} as never,
      },
      p,
      { tokenHash: 'abc', emailNormalized: 'a@b.com' },
    );
    assert.equal(fields.amountInCents, 15000000);
    assert.equal(fields.baseAmountInCents, 25000000);
    assert.equal(fields.discountAmountInCents, 10000000);
    assert.equal(fields.discountPercent, 40);
    assert.equal(fields.invitationEmailNormalized, 'a@b.com');
  });

  it('PURCHASED invitation blocks reserve', async () => {
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
    const r = await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-new');
    assert.equal(r.ok, false);
  });

  it('checkout without session blocked', async () => {
    const req = { headers: {} } as NextApiRequest;
    const r = await assertRenaserInvitationCheckout(req, 'x@example.com', 'ss-renaser-x');
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.match(r.error, /exclusivamente para invitados/i);
    }
  });

  it('valid invited client total 150000 accepted', () => {
    assert.equal(validateRenaserInvitedClientTotalPrice(150000), true);
    assert.equal(validateRenaserClientTotalPrice(150000), true);
  });
});
