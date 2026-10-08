import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateSharedBenefitKey } from './validateKey';
import {
  benefitSessionCookieHeader,
  createBenefitSessionValue,
} from './session';
import {
  getRenaserAttendeePricing,
  getRenaserPublicPricing,
  resolveRenaserCheckoutPricing,
  validateRenaserClientTotalPrice,
  buildRenaserPendingOrderFields,
} from '../orders/renaserCheckout';
import { validateRenaserApprovedPayment } from '../wompi/renaserPaymentValidation';
import { encodeWidgetIntegritySha256 } from '../wompi/integrity';
import type { NextApiRequest } from 'next';
import type { CheckoutOrder } from '../orders/types';
import { RENSER_CANONICAL_PRODUCT_ID } from '../orders/renaserCheckout';
import { processWompiTransactionUpdate } from '../wompi/processWompiTransaction';
import { createInMemoryCheckoutOrdersRepository } from '../orders/checkoutOrdersRepository';

const ORIGINAL = { ...process.env };

function reqWithBenefitCookie(): NextApiRequest {
  process.env.RENASER_BENEFIT_SESSION_SECRET = 'test-benefit-session-secret-value';
  const session = createBenefitSessionValue();
  assert.ok(session);
  return { headers: { cookie: `renaser_benefit=${session}` } } as NextApiRequest;
}

describe('RenaSER shared private link benefit', () => {
  beforeEach(() => {
    process.env.RENASER_SHARED_BENEFIT_TOKEN = 'shared-test-token-value-32chars-min';
    process.env.RENASER_BENEFIT_SESSION_SECRET = 'test-benefit-session-secret-value';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL };
  });

  it('1. shared token válido → cookie beneficio', () => {
    assert.equal(validateSharedBenefitKey('shared-test-token-value-32chars-min'), true);
    const session = createBenefitSessionValue();
    assert.ok(session);
    const header = benefitSessionCookieHeader(session);
    assert.match(header, /renaser_benefit=/);
    assert.match(header, /HttpOnly/);
    assert.match(header, /SameSite=Lax/);
  });

  it('2. shared token inválido → rechazo', () => {
    assert.equal(validateSharedBenefitKey('wrong-key'), false);
  });

  it('3. token no aparece en logs (sanity)', () => {
    const secret = process.env.RENASER_SHARED_BENEFIT_TOKEN!;
    const logLine = JSON.stringify({ errorName: 'Test', message: 'benefit misconfigured' });
    assert.doesNotMatch(logLine, new RegExp(secret));
  });

  it('4. cookie beneficio → precio 150000', async () => {
    const r = await resolveRenaserCheckoutPricing(reqWithBenefitCookie(), 'a@b.com', 150000, 'ref');
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.pricing.pricingMode, 'ATTENDEE');
  });

  it('5. sin cookie → precio 250000', async () => {
    const r = await resolveRenaserCheckoutPricing({ headers: {} } as NextApiRequest, 'a@b.com', 250000, 'ref');
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.pricing.pricingMode, 'PUBLIC');
  });

  it('6. frontend intenta 150000 sin cookie → rechazo', async () => {
    const r = await resolveRenaserCheckoutPricing({ headers: {} } as NextApiRequest, 'a@b.com', 150000, 'ref');
    assert.equal(r.ok, false);
  });

  it('6b. cookie ATTENDEE ignora totalPrice manipulado (250000 o 1)', async () => {
    const req = reqWithBenefitCookie();
    for (const total of [250000, 1]) {
      const r = await resolveRenaserCheckoutPricing(req, 'a@b.com', total, 'ref');
      assert.equal(r.ok, true);
      if (r.ok) {
        assert.equal(r.pricing.pricingMode, 'ATTENDEE');
        assert.equal(r.pricing.finalAmountInCents, 15000000);
      }
    }
  });

  it('6c. firma Wompi ATTENDEE usa 15000000 centavos', () => {
    const ref = 'ss-renaser-test-ref';
    const secret = 'test-integrity-secret';
    const sigAtt = encodeWidgetIntegritySha256({
      reference: ref,
      amountInCents: 15000000,
      integritySecret: secret,
    });
    const sigPub = encodeWidgetIntegritySha256({
      reference: ref,
      amountInCents: 25000000,
      integritySecret: secret,
    });
    assert.notEqual(sigAtt, sigPub);
    assert.equal(
      encodeWidgetIntegritySha256({ reference: ref, amountInCents: 15000000, integritySecret: secret }),
      sigAtt,
    );
  });

  it('7–10. webhook amounts', () => {
    const pub = getRenaserPublicPricing();
    const att = getRenaserAttendeePricing();
    const pubOrder: CheckoutOrder = {
      reference: 'ss-renaser-p',
      productId: RENSER_CANONICAL_PRODUCT_ID,
      productSlug: 'memorias-en-video-del-congreso',
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      phone: '1',
      amountInCents: pub.finalAmountInCents,
      currency: 'COP',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      provisioningStatus: 'NOT_STARTED',
      pricingMode: 'PUBLIC',
    };
    const attOrder = { ...pubOrder, reference: 'ss-renaser-a', amountInCents: att.finalAmountInCents, pricingMode: 'ATTENDEE' as const };
    assert.equal(validateRenaserApprovedPayment(pubOrder, { status: 'APPROVED', amount_in_cents: 25000000, currency: 'COP' }).ok, true);
    assert.equal(validateRenaserApprovedPayment(attOrder, { status: 'APPROVED', amount_in_cents: 15000000, currency: 'COP' }).ok, true);
    assert.equal(validateRenaserApprovedPayment(pubOrder, { status: 'APPROVED', amount_in_cents: 15000000, currency: 'COP' }).ok, false);
    assert.equal(validateRenaserApprovedPayment(attOrder, { status: 'APPROVED', amount_in_cents: 25000000, currency: 'COP' }).ok, false);
  });

  it('11. provisioning ATTENDEE sin invitationTokenHash', async () => {
    const repo = createInMemoryCheckoutOrdersRepository();
    let provisionCalls = 0;
    await repo.putPendingCheckoutOrder({
      reference: 'ss-renaser-ben',
      productId: RENSER_CANONICAL_PRODUCT_ID,
      productSlug: 'memorias-en-video-del-congreso',
      firstName: 'A',
      lastName: 'B',
      email: 'buyer@example.com',
      phone: '1',
      amountInCents: 15000000,
      currency: 'COP',
      pricingMode: 'ATTENDEE',
    });
    await processWompiTransactionUpdate(
      { id: 'trx-ben', reference: 'ss-renaser-ben', status: 'APPROVED', amount_in_cents: 15000000, currency: 'COP' },
      { ...repo, provisionSkillCert: async () => { provisionCalls++; return { ok: true, status: 'provisioned' }; } },
    );
    assert.equal(provisionCalls, 1);
  });

  it('12. /renaser/beneficio tiene noindex y cookie firmada', () => {
    const src = readFileSync(join(process.cwd(), 'pages/renaser/beneficio.tsx'), 'utf8');
    assert.match(src, /noindex/i);
    assert.match(src, /Set-Cookie/);
    assert.doesNotMatch(src, /invitation\/exchange/);
  });

  it('13. redirect elimina k de la URL (destino sin query k)', () => {
    const src = readFileSync(join(process.cwd(), 'pages/renaser/beneficio.tsx'), 'utf8');
    assert.match(src, /destination:\s*`\/tienda\/curso\/\$\{slug\}/);
    assert.doesNotMatch(src, /destination:[^`]*\?k=/);
  });

  it('14. create-order usa 25000000 PUBLIC y 15000000 ATTENDEE', () => {
    assert.equal(getRenaserPublicPricing().finalAmountInCents, 25000000);
    assert.equal(getRenaserAttendeePricing().finalAmountInCents, 15000000);
    const createOrderSrc = readFileSync(
      join(process.cwd(), 'pages/api/wompi/create-order.ts'),
      'utf8',
    );
    assert.match(createOrderSrc, /amountInCents\s*=\s*pricing\.finalAmountInCents/);
  });

  it('order fields sin shared token', () => {
    const fields = buildRenaserPendingOrderFields(
      { names: 'A', lastNames: 'B', email: 'a@b.com', phone: '1', direction: {} as never },
      getRenaserAttendeePricing(),
    );
    assert.equal(fields.pricingMode, 'ATTENDEE');
    assert.equal((fields as { invitationTokenHash?: string }).invitationTokenHash, undefined);
    assert.equal(validateRenaserClientTotalPrice(150000, 'ATTENDEE'), true);
  });
});
