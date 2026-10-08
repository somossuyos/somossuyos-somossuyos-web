import assert from 'node:assert/strict';
import { describe, it, afterEach } from 'node:test';
import {
  calculateRenaserInvitationPricing,
  validateRenaserInvitedClientTotalPrice,
} from './renaserInvitations/pricing';
import {
  buildRenaserPendingOrderFields,
  getRenaserPublicPricing,
  getRenaserAmountInCents,
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

const ORIGINAL = { ...process.env };

function publicOrder(overrides: Partial<CheckoutOrder> = {}): CheckoutOrder {
  const pricing = getRenaserPublicPricing();
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
    benefitAmountInCents: 0,
    pricingMode: 'PUBLIC',
    discountPercent: 0,
    discountAmountInCents: 0,
    currency: 'COP',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    provisioningStatus: 'NOT_STARTED',
    ...overrides,
  };
}

describe('RenaSER precio único PUBLIC', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL };
    process.env.RENASER_SHARED_BENEFIT_TOKEN = 'test-shared-benefit-token-value';
  });

  it('1. público compra a 250000', async () => {
    const req = { headers: {} } as NextApiRequest;
    const r = await resolveRenaserCheckoutPricing(req, 'public@example.com', 250000, 'ss-renaser-pub');
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.pricing.pricingMode, 'PUBLIC');
  });

  it('2. enlace privado (sin cookie) también exige 250000', async () => {
    const r = await resolveRenaserCheckoutPricing({ headers: {} } as NextApiRequest, 'a@b.com', 250000, 'ss-renaser-a');
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.pricing.finalPriceCop, 250000);
  });

  it('3–4. amountInCents Wompi siempre 25000000', () => {
    assert.equal(getRenaserPublicPricing().finalAmountInCents, 25000000);
    assert.equal(getRenaserAmountInCents(), 25000000);
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
      validateRenaserApprovedPayment(publicOrder(), {
        status: 'APPROVED',
        amount_in_cents: 15000000,
        currency: 'COP',
      }).ok,
      false,
    );
  });

  it('9. cualquier email válido a precio lista', async () => {
    const r = await resolveRenaserCheckoutPricing({ headers: {} } as NextApiRequest, 'any@example.com', 250000, 'ref');
    assert.equal(r.ok, true);
  });

  it('10. 150000 rechazado', async () => {
    const r = await resolveRenaserCheckoutPricing({ headers: {} } as NextApiRequest, 'x@example.com', 150000, 'ref');
    assert.equal(r.ok, false);
  });

  it('14. order metadata PUBLIC sin descuento', () => {
    const pub = buildRenaserPendingOrderFields(
      { names: 'A', lastNames: 'B', email: 'a@b.com', phone: '1', direction: {} as never },
      getRenaserPublicPricing(),
    );
    assert.equal(pub.pricingMode, 'PUBLIC');
    assert.equal(pub.amountInCents, 25000000);
    assert.equal(pub.benefitAmountInCents, 0);
    assert.equal(pub.discountPercent, 0);
  });

  it('pricing helpers sin descuento', () => {
    const p = calculateRenaserInvitationPricing();
    assert.equal(p.finalPriceCop, 250000);
    assert.equal(p.discountAmountCop, 0);
    assert.equal(validateRenaserInvitedClientTotalPrice(250000), true);
    assert.equal(validateRenaserInvitedClientTotalPrice(150000), false);
    assert.equal(validateRenaserClientTotalPrice(250000), true);
    assert.match(formatPrice(p.basePriceCop), /250\.?000/);
  });

  it('email template sin mención de descuento', () => {
    process.env.RENASER_SHARED_BENEFIT_TOKEN = 'test-shared-benefit-token-value';
    const email = buildPurchaseInvitationEmail({ firstName: 'Ana' });
    assert.doesNotMatch(email.text, /40\s*%/i);
    assert.doesNotMatch(email.text, /descuento/i);
    assert.doesNotMatch(email.text, /150\.?000/i);
    assert.equal(PURCHASE_INVITATION_SUBJECT, 'Memorias del Congreso RenaSER 2026');
    assert.match(email.html, new RegExp(PURCHASE_INVITATION_CTA_LABEL));
    assert.doesNotMatch(email.text, /test-token-value/);
  });
});
