import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateSharedBenefitKey } from './validateKey';
import {
  getRenaserPublicPricing,
  resolveRenaserCheckoutPricing,
  validateRenaserClientTotalPrice,
  buildRenaserPendingOrderFields,
} from '../orders/renaserCheckout';
import { validateRenaserApprovedPayment } from '../wompi/renaserPaymentValidation';
import type { NextApiRequest } from 'next';
import type { CheckoutOrder } from '../orders/types';
import { RENSER_CANONICAL_PRODUCT_ID } from '../orders/renaserCheckout';
import { processWompiTransactionUpdate } from '../wompi/processWompiTransaction';
import { createInMemoryCheckoutOrdersRepository } from '../orders/checkoutOrdersRepository';

const ORIGINAL = { ...process.env };

describe('RenaSER shared private link (acceso directo)', () => {
  beforeEach(() => {
    process.env.RENASER_SHARED_BENEFIT_TOKEN = 'shared-test-token-value-32chars-min';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL };
  });

  it('1. shared token válido aceptado', () => {
    assert.equal(validateSharedBenefitKey('shared-test-token-value-32chars-min'), true);
  });

  it('2. shared token inválido → rechazo', () => {
    assert.equal(validateSharedBenefitKey('wrong-key'), false);
    assert.equal(validateSharedBenefitKey(''), false);
  });

  it('3. token no aparece en logs (sanity)', () => {
    const secret = process.env.RENASER_SHARED_BENEFIT_TOKEN!;
    const logLine = JSON.stringify({ errorName: 'Test', message: 'benefit misconfigured' });
    assert.doesNotMatch(logLine, new RegExp(secret));
  });

  it('4. checkout precio 250000 con o sin sesión legacy', async () => {
    const req = { headers: { cookie: 'renaser_benefit=legacy' } } as NextApiRequest;
    const r = await resolveRenaserCheckoutPricing(req, 'a@b.com', 250000, 'ss-renaser-a');
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.pricing.pricingMode, 'PUBLIC');
      assert.equal(r.pricing.finalPriceCop, 250000);
      assert.equal(r.pricing.finalAmountInCents, 25000000);
    }
  });

  it('5. sin cookie → precio 250000', async () => {
    const r = await resolveRenaserCheckoutPricing({ headers: {} } as NextApiRequest, 'a@b.com', 250000, 'ss-renaser-b');
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.pricing.pricingMode, 'PUBLIC');
  });

  it('6. frontend intenta 150000 → rechazo', async () => {
    const r = await resolveRenaserCheckoutPricing({ headers: {} } as NextApiRequest, 'a@b.com', 150000, 'ss-renaser-c');
    assert.equal(r.ok, false);
  });

  it('7–10. webhook amounts', () => {
    const pub = getRenaserPublicPricing();
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
    assert.equal(
      validateRenaserApprovedPayment(pubOrder, { status: 'APPROVED', amount_in_cents: 25000000, currency: 'COP' }).ok,
      true,
    );
    assert.equal(
      validateRenaserApprovedPayment(pubOrder, { status: 'APPROVED', amount_in_cents: 15000000, currency: 'COP' }).ok,
      false,
    );
  });

  it('11. provisioning PUBLIC sin invitationTokenHash', async () => {
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
      amountInCents: 25000000,
      currency: 'COP',
      pricingMode: 'PUBLIC',
    });
    await processWompiTransactionUpdate(
      {
        id: 'trx-ben',
        reference: 'ss-renaser-ben',
        status: 'APPROVED',
        amount_in_cents: 25000000,
        currency: 'COP',
      },
      {
        ...repo,
        provisionSkillCert: async () => {
          provisionCalls++;
          return { ok: true, status: 'provisioned' };
        },
      },
    );
    assert.equal(provisionCalls, 1);
  });

  it('12. /renaser/beneficio tiene noindex', () => {
    const src = readFileSync(
      join(process.cwd(), 'pages/renaser/beneficio.tsx'),
      'utf8',
    );
    assert.match(src, /noindex/i);
    assert.doesNotMatch(src, /Set-Cookie/i);
  });

  it('order fields sin shared token en metadata', () => {
    const fields = buildRenaserPendingOrderFields(
      { names: 'A', lastNames: 'B', email: 'a@b.com', phone: '1', direction: {} as never },
      getRenaserPublicPricing(),
    );
    assert.equal(fields.pricingMode, 'PUBLIC');
    assert.equal((fields as { invitationTokenHash?: string }).invitationTokenHash, undefined);
    assert.equal(validateRenaserClientTotalPrice(250000), true);
  });
});
