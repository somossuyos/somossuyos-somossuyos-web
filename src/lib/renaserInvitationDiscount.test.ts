import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';
import {
  calculateRenaserInvitationPricing,
  validateRenaserInvitedClientTotalPrice,
} from './renaserInvitations/pricing';
import {
  buildRenaserPendingOrderFields,
  getRenaserPublicPricing,
  getRenaserInvitedPricing,
  validateRenaserClientTotalPrice,
  resolveRenaserCheckoutPricing,
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
import {
  consumeInvitationOnApprovedPayment,
  releaseInvitationIfPaymentFailed,
} from './renaserInvitations/webhookInvitation';
import { assertRenaserInvitationCheckout } from './renaserInvitations/checkoutGuard';
import type { NextApiRequest } from 'next';
import { formatPrice } from '../utils/formatPrice';
const ORIGINAL = { ...process.env };

function order(overrides: Partial<CheckoutOrder> = {}): CheckoutOrder {
  const pricing = getRenaserInvitedPricing();
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
    benefitAmountInCents: pricing.benefitAmountInCents,
    pricingMode: 'INVITED',
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

function publicOrder(overrides: Partial<CheckoutOrder> = {}): CheckoutOrder {
  const pricing = getRenaserPublicPricing();
  return order({
    amountInCents: pricing.finalAmountInCents,
    baseAmountInCents: pricing.baseAmountInCents,
    benefitAmountInCents: 0,
    pricingMode: 'PUBLIC',
    discountPercent: 0,
    discountAmountInCents: 0,
    invitationTokenHash: undefined,
    invitationEmailNormalized: undefined,
    ...overrides,
  });
}

describe('RenaSER PUBLIC_FULL_PRICE + INVITED_SPECIAL_PRICE', () => {
  beforeEach(() => {
    process.env.RENASER_INVITATIONS_ENFORCE = 'true';
    process.env.RENASER_INVITATION_SESSION_SECRET = 'test-session-secret-for-renaser';
  });
  afterEach(() => {
    process.env = { ...ORIGINAL };
  });

  it('1. público sin invitación compra a 250000', async () => {
    const req = { headers: {} } as NextApiRequest;
    const r = await resolveRenaserCheckoutPricing(req, 'public@example.com', 250000, 'ss-renaser-pub');
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.pricing.pricingMode, 'PUBLIC');
      assert.equal(r.pricing.finalPriceCop, 250000);
      assert.equal(r.invitation, undefined);
    }
  });

  it('2. invitado válido compra a 150000', async () => {
    const repo = createInMemoryInvitationsRepository();
    const tokenHash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash,
      emailNormalized: 'inv@example.com',
      firstName: 'I',
      lastName: 'N',
    });
    const reserved = await repo.tryReserveInvitationForCheckout(tokenHash, 'ss-renaser-inv');
    assert.equal(reserved.ok, true);
    assert.equal(validateRenaserClientTotalPrice(150000, 'INVITED'), true);
    assert.equal(getRenaserInvitedPricing().finalPriceCop, 150000);
  });

  it('3. público amountInCents = 25000000', () => {
    assert.equal(getRenaserPublicPricing().finalAmountInCents, 25000000);
  });

  it('4. invitado amountInCents = 15000000', () => {
    assert.equal(getRenaserInvitedPricing().finalAmountInCents, 15000000);
  });

  it('5. webhook público con 25000000 PASS', () => {
    const o = publicOrder();
    const r = validateRenaserApprovedPayment(o, {
      status: 'APPROVED',
      amount_in_cents: 25000000,
      currency: 'COP',
    });
    assert.equal(r.ok, true);
  });

  it('6. webhook invitado con 15000000 PASS', () => {
    const o = order();
    const r = validateRenaserApprovedPayment(o, {
      status: 'APPROVED',
      amount_in_cents: 15000000,
      currency: 'COP',
    });
    assert.equal(r.ok, true);
  });

  it('7. webhook público con 15000000 FAIL', () => {
    const o = publicOrder();
    const r = validateRenaserApprovedPayment(o, {
      status: 'APPROVED',
      amount_in_cents: 15000000,
      currency: 'COP',
    });
    assert.equal(r.ok, false);
  });

  it('8. webhook invitado con 25000000 FAIL', () => {
    const o = order();
    const r = validateRenaserApprovedPayment(o, {
      status: 'APPROVED',
      amount_in_cents: 25000000,
      currency: 'COP',
    });
    assert.equal(r.ok, false);
  });

  it('9. público puede editar email (sin lock en backend)', async () => {
    const req = { headers: {} } as NextApiRequest;
    const r = await resolveRenaserCheckoutPricing(req, 'any@example.com', 250000, 'ss-renaser-pub2');
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.emailNormalized, 'any@example.com');
  });

  it('10. invitado email bloqueado en guard (mismatch)', async () => {
    const req = { headers: {} } as NextApiRequest;
    const r = await assertRenaserInvitationCheckout(req, 'x@example.com', 'ss-renaser-x');
    assert.equal(r.ok, false);
  });

  it('11. compra pública no toca invitation table', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'stay@example.com',
      firstName: 'S',
      lastName: 'T',
    });
    const consume = await consumeInvitationOnApprovedPayment(
      publicOrder({ email: 'buyer@example.com' }),
      'trx-pub',
      repo,
    );
    assert.equal(consume.ok, true);
    assert.equal((await repo.getInvitationByTokenHash(hash))?.status, 'AVAILABLE');
  });

  it('12. compra invitada APPROVED consume invitación', async () => {
    const repo = createInMemoryInvitationsRepository();
    const hash = hashInvitationToken(generateInvitationToken());
    await repo.putInvitationIfNotExists({
      tokenHash: hash,
      emailNormalized: 'ok@example.com',
      firstName: 'O',
      lastName: 'K',
    });
    await repo.tryReserveInvitationForCheckout(hash, 'ss-renaser-ok');
    const c = await consumeInvitationOnApprovedPayment(
      order({ reference: 'ss-renaser-ok', invitationTokenHash: hash, email: 'ok@example.com' }),
      'trx',
      repo,
    );
    assert.equal(c.ok, true);
    assert.equal((await repo.getInvitationByTokenHash(hash))?.status, 'PURCHASED');
  });

  it('13. DECLINED invitado no consume', async () => {
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

  it('14. provisioning metadata en ambos caminos', () => {
    const pub = buildRenaserPendingOrderFields(
      { names: 'A', lastNames: 'B', email: 'a@b.com', phone: '1', direction: {} as never },
      getRenaserPublicPricing(),
    );
    assert.equal(pub.pricingMode, 'PUBLIC');
    assert.equal(pub.amountInCents, 25000000);
    assert.equal(pub.benefitAmountInCents, 0);

    const inv = buildRenaserPendingOrderFields(
      { names: 'A', lastNames: 'B', email: 'a@b.com', phone: '1', direction: {} as never },
      getRenaserInvitedPricing(),
      { tokenHash: 'abc', emailNormalized: 'a@b.com' },
    );
    assert.equal(inv.pricingMode, 'INVITED');
    assert.equal(inv.amountInCents, 15000000);
    assert.equal(inv.benefitAmountInCents, 10000000);
  });

  it('15. producto precio lista 250k (helpers)', () => {
    const p = getRenaserPublicPricing();
    assert.equal(p.finalPriceCop, 250000);
    assert.match(formatPrice(p.basePriceCop), /250\.?000/);
  });

  it('backend invited pricing final = 150000 COP', () => {
    const p = calculateRenaserInvitationPricing();
    assert.equal(p.basePriceCop, 250000);
    assert.equal(p.discountAmountCop, 100000);
    assert.equal(p.finalPriceCop, 150000);
    assert.equal(p.finalAmountInCents, 15000000);
  });

  it('frontend sends wrong totals rejected', () => {
    assert.equal(validateRenaserInvitedClientTotalPrice(100000), false);
    assert.equal(validateRenaserClientTotalPrice(100000, 'PUBLIC'), false);
    assert.equal(validateRenaserClientTotalPrice(100000, 'INVITED'), false);
    assert.equal(validateRenaserClientTotalPrice(250000, 'INVITED'), false);
    assert.equal(validateRenaserClientTotalPrice(150000, 'PUBLIC'), false);
  });

  it('checkout without session allowed at public price only', async () => {
    const req = { headers: {} } as NextApiRequest;
    const r = await resolveRenaserCheckoutPricing(req, 'x@example.com', 250000, 'ss-renaser-x');
    assert.equal(r.ok, true);
    const bad = await resolveRenaserCheckoutPricing(req, 'x@example.com', 150000, 'ss-renaser-y');
    assert.equal(bad.ok, false);
  });

  it('email template contains 150.000 COP', () => {
    const email = buildPurchaseInvitationEmail({ firstName: 'Ana', token: 'test-token-value' });
    assert.match(email.text, /150\.000 COP/);
    assert.equal(PURCHASE_INVITATION_SUBJECT, 'Memorias del Congreso RenaSER 2026');
    assert.match(email.html, new RegExp(PURCHASE_INVITATION_CTA_LABEL));
  });
});
