import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';
import {
  calculateRenaserInvitationPricing,
  validateRenaserInvitedClientTotalPrice,
} from './renaserInvitations/pricing';
import {
  buildRenaserPendingOrderFields,
  getRenaserPublicPricing,
  getRenaserAttendeePricing,
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
import type { NextApiRequest } from 'next';
import { formatPrice } from '../utils/formatPrice';
import { createBenefitSessionValue } from './renaserBenefit/session';

const ORIGINAL = { ...process.env };

function reqWithBenefit(): NextApiRequest {
  const session = createBenefitSessionValue();
  assert.ok(session);
  return { headers: { cookie: `renaser_benefit=${session}` } } as NextApiRequest;
}

function order(overrides: Partial<CheckoutOrder> = {}): CheckoutOrder {
  const pricing = getRenaserAttendeePricing();
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
    pricingMode: 'ATTENDEE',
    discountPercent: pricing.discountPercent,
    discountAmountInCents: pricing.discountAmountInCents,
    currency: 'COP',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    provisioningStatus: 'NOT_STARTED',
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
    ...overrides,
  });
}

describe('RenaSER PUBLIC + shared benefit ATTENDEE', () => {
  beforeEach(() => {
    process.env.RENASER_SHARED_BENEFIT_TOKEN = 'test-shared-benefit-token-value';
    process.env.RENASER_BENEFIT_SESSION_SECRET = 'test-benefit-session-secret-value';
  });
  afterEach(() => {
    process.env = { ...ORIGINAL };
  });

  it('1. público sin beneficio compra a 250000', async () => {
    const req = { headers: {} } as NextApiRequest;
    const r = await resolveRenaserCheckoutPricing(req, 'public@example.com', 250000, 'ss-renaser-pub');
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.pricing.pricingMode, 'PUBLIC');
  });

  it('2. asistente con cookie compra a 150000', async () => {
    const r = await resolveRenaserCheckoutPricing(reqWithBenefit(), 'a@b.com', 150000, 'ss-renaser-a');
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.pricing.pricingMode, 'ATTENDEE');
  });

  it('3–4. amountInCents Wompi', () => {
    assert.equal(getRenaserPublicPricing().finalAmountInCents, 25000000);
    assert.equal(getRenaserAttendeePricing().finalAmountInCents, 15000000);
  });

  it('5–8. webhook amounts', () => {
    assert.equal(
      validateRenaserApprovedPayment(publicOrder(), {
        status: 'APPROVED',
        amount_in_cents: 25000000,
        currency: 'COP',
      }).ok,
      true,
    );
    assert.equal(
      validateRenaserApprovedPayment(order(), {
        status: 'APPROVED',
        amount_in_cents: 15000000,
        currency: 'COP',
      }).ok,
      true,
    );
    assert.equal(
      validateRenaserApprovedPayment(publicOrder(), {
        status: 'APPROVED',
        amount_in_cents: 15000000,
        currency: 'COP',
      }).ok,
      false,
    );
    assert.equal(
      validateRenaserApprovedPayment(order(), {
        status: 'APPROVED',
        amount_in_cents: 25000000,
        currency: 'COP',
      }).ok,
      false,
    );
  });

  it('9. público puede usar cualquier email', async () => {
    const r = await resolveRenaserCheckoutPricing({ headers: {} } as NextApiRequest, 'any@example.com', 250000, 'ref');
    assert.equal(r.ok, true);
  });

  it('10. 150000 sin cookie rechazado', async () => {
    const r = await resolveRenaserCheckoutPricing({ headers: {} } as NextApiRequest, 'x@example.com', 150000, 'ref');
    assert.equal(r.ok, false);
  });

  it('14. order metadata ATTENDEE/PUBLIC', () => {
    const pub = buildRenaserPendingOrderFields(
      { names: 'A', lastNames: 'B', email: 'a@b.com', phone: '1', direction: {} as never },
      getRenaserPublicPricing(),
    );
    assert.equal(pub.pricingMode, 'PUBLIC');
    const att = buildRenaserPendingOrderFields(
      { names: 'A', lastNames: 'B', email: 'a@b.com', phone: '1', direction: {} as never },
      getRenaserAttendeePricing(),
    );
    assert.equal(att.pricingMode, 'ATTENDEE');
    assert.equal(att.amountInCents, 15000000);
  });

  it('pricing helpers', () => {
    const p = calculateRenaserInvitationPricing();
    assert.equal(p.finalPriceCop, 150000);
    assert.equal(validateRenaserInvitedClientTotalPrice(150000), true);
    assert.equal(validateRenaserClientTotalPrice(250000, 'PUBLIC'), true);
    assert.equal(validateRenaserClientTotalPrice(150000, 'ATTENDEE'), true);
    assert.match(formatPrice(p.basePriceCop), /250\.?000/);
  });

  it('email template shared link copy', () => {
    const email = buildPurchaseInvitationEmail({ firstName: 'Ana' });
    assert.match(email.text, /40\s*%\s*de descuento/i);
    assert.equal(PURCHASE_INVITATION_SUBJECT, 'Memorias del Congreso RenaSER 2026');
    assert.match(email.html, new RegExp(PURCHASE_INVITATION_CTA_LABEL));
    assert.doesNotMatch(email.text, /test-token-value/);
  });
});
