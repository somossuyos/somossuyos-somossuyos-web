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

describe('RenaSER PUBLIC + shared benefit ATTENDEE', () => {
  beforeEach(() => {
    process.env.RENASER_SHARED_BENEFIT_TOKEN = 'test-shared-benefit-token-value';
    process.env.RENASER_BENEFIT_SESSION_SECRET = 'test-benefit-session-secret-value';
  });
  afterEach(() => {
    process.env = { ...ORIGINAL };
  });

  it('público 250k y asistente 150k con cookie', async () => {
    const pub = await resolveRenaserCheckoutPricing({ headers: {} } as NextApiRequest, 'a@b.com', 250000, 'r1');
    assert.equal(pub.ok, true);
    const att = await resolveRenaserCheckoutPricing(reqWithBenefit(), 'a@b.com', 150000, 'r2');
    assert.equal(att.ok, true);
    if (att.ok) assert.equal(att.pricing.pricingMode, 'ATTENDEE');
  });

  it('Wompi cents public/attendee', () => {
    assert.equal(getRenaserPublicPricing().finalAmountInCents, 25000000);
    assert.equal(getRenaserAttendeePricing().finalAmountInCents, 15000000);
  });

  it('webhook validation', () => {
    const pub: CheckoutOrder = {
      reference: 'p',
      productId: RENSER_CANONICAL_PRODUCT_ID,
      productSlug: 'memorias-en-video-del-congreso',
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      phone: '1',
      amountInCents: 25000000,
      currency: 'COP',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      provisioningStatus: 'NOT_STARTED',
    };
    const att = { ...pub, reference: 'a', amountInCents: 15000000 };
    assert.equal(validateRenaserApprovedPayment(pub, { status: 'APPROVED', amount_in_cents: 25000000, currency: 'COP' }).ok, true);
    assert.equal(validateRenaserApprovedPayment(att, { status: 'APPROVED', amount_in_cents: 15000000, currency: 'COP' }).ok, true);
  });

  it('email template 40% shared link', () => {
    const email = buildPurchaseInvitationEmail({ firstName: 'Ana' });
    assert.match(email.text, /40\s*%\s*de descuento/i);
    assert.equal(PURCHASE_INVITATION_SUBJECT, 'Memorias del Congreso RenaSER 2026');
    assert.match(email.html, new RegExp(PURCHASE_INVITATION_CTA_LABEL));
  });

  it('pricing helpers', () => {
    const p = calculateRenaserInvitationPricing();
    assert.equal(p.finalPriceCop, 150000);
    assert.equal(validateRenaserInvitedClientTotalPrice(150000), true);
    assert.equal(validateRenaserClientTotalPrice(250000, 'PUBLIC'), true);
    assert.equal(validateRenaserClientTotalPrice(150000, 'ATTENDEE'), true);
    assert.match(formatPrice(p.basePriceCop), /250\.?000/);
  });

  it('order metadata', () => {
    const att = buildRenaserPendingOrderFields(
      { names: 'A', lastNames: 'B', email: 'a@b.com', phone: '1', direction: {} as never },
      getRenaserAttendeePricing(),
    );
    assert.equal(att.pricingMode, 'ATTENDEE');
    assert.equal(att.amountInCents, 15000000);
  });
});
