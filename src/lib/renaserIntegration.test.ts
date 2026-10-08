import assert from 'node:assert/strict';
import { describe, it, before, afterEach } from 'node:test';
import crypto from 'node:crypto';
import {
  createInMemoryCheckoutOrdersRepository,
} from './orders/checkoutOrdersRepository';
import type { CheckoutOrdersStore } from './orders/checkoutOrdersStore.types';
import type { SkillCertProvisionResult } from './skillcert/provision';
import { buildRenaserOrderReference, isRenaserOrderReference } from './orders/reference';
import {
  getRenaserAmountInCents,
  getRenaserPriceCop,
  validateRenaserClientTotalPrice,
  RENSER_CANONICAL_PRODUCT_ID,
} from './orders/renaserCheckout';
import { evaluateWompiWebhookAuth } from './wompi/webhookAuthPolicy';
import { verifyWompiEventChecksum } from './wompi/webhookVerify';
import {
  shouldSendNovenaDigitalFulfillment,
  validateRenaserApprovedPayment,
} from './wompi/renaserPaymentValidation';
import { processWompiTransactionUpdate } from './wompi/processWompiTransaction';
import type { CheckoutOrder } from './orders/types';
import { signSkillCertRequest } from './skillcert/provision';

const ORIGINAL_ENV = { ...process.env, RENASER_INVITATIONS_ENFORCE: 'false' };

before(() => {
  process.env.RENASER_INVITATIONS_ENFORCE = 'false';
});

function baseOrder(overrides: Partial<CheckoutOrder> = {}): CheckoutOrder {
  return {
    reference: 'ss-renaser-test-1',
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

describe('RenaSER checkout pricing', () => {
  it('1. server price is 250000 COP / 25000000 cents', () => {
    assert.equal(getRenaserPriceCop(), 250000);
    assert.equal(getRenaserAmountInCents(), 25000000);
  });

  it('2. rejects altered client total', () => {
    assert.equal(validateRenaserClientTotalPrice(250000), true);
    assert.equal(validateRenaserClientTotalPrice(1), false);
  });
});

describe('Orders persistence', () => {
  it('3. create-order flow persists PENDING order', async () => {
    const repo = createInMemoryCheckoutOrdersRepository();
    const ref = buildRenaserOrderReference();
    const order = await repo.putPendingCheckoutOrder({
      reference: ref,
      productId: RENSER_CANONICAL_PRODUCT_ID,
      productSlug: 'memorias-en-video-del-congreso',
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      phone: '1',
      amountInCents: 25000000,
      currency: 'COP',
    });
    assert.equal(order.status, 'PENDING');
    const loaded = await repo.getCheckoutOrderByReference(ref);
    assert.ok(loaded);
    assert.equal(loaded.email, 'a@b.com');
  });

  it('4. reference is unique', () => {
    const a = buildRenaserOrderReference();
    const b = buildRenaserOrderReference();
    assert.notEqual(a, b);
    assert.ok(isRenaserOrderReference(a));
  });
});

describe('Webhook auth RenaSER channel', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('uses RENASER events secret for ss-renaser reference', () => {
    process.env.RENASER_WOMPI_EVENTS_SECRET = 'renaser-events-test-secret';
    delete process.env.WOMPI_EVENTS_SECRET;
    const body = {
      timestamp: 1700000000,
      data: {
        transaction: { id: 't1', status: 'APPROVED', reference: 'ss-renaser-uuid-1' },
      },
      signature: { properties: [] as string[], checksum: 'x' },
    };
    const r = evaluateWompiWebhookAuth({}, body);
    assert.equal(r.ok, false);
    if (!r.ok) assert.match(r.detail ?? '', /missing_signature_payload|checksum/);
  });
});

describe('Webhook auth fail-closed', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('5. rejects when secret configured and signature missing', () => {
    process.env.WOMPI_EVENTS_SECRET = 'test-events-secret';
    delete process.env.WOMPI_WEBHOOK_DISABLE_VERIFY;
    const r = evaluateWompiWebhookAuth({}, { data: { transaction: { id: '1' } } });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.httpStatus, 401);
  });

  it('6. rejects invalid signature', () => {
    process.env.WOMPI_EVENTS_SECRET = 'test-events-secret';
    const body = {
      timestamp: 1700000000,
      data: { transaction: { id: 'trx-1', status: 'APPROVED' } },
      signature: {
        properties: ['transaction.id', 'transaction.status'],
        checksum: 'deadbeef',
      },
    };
    const v = verifyWompiEventChecksum(body, body.signature.checksum);
    assert.equal(v.ok, false);
    const r = evaluateWompiWebhookAuth({}, body);
    assert.equal(r.ok, false);
  });
});

describe('Webhook processing', () => {
  let repo: CheckoutOrdersStore & ReturnType<typeof createInMemoryCheckoutOrdersRepository>;
  let provisionCalls: number;

  before(() => {
    repo = createInMemoryCheckoutOrdersRepository();
    provisionCalls = 0;
  });

  const trxApproved = (ref: string, cents = 25000000) => ({
    id: 'wompi-trx-1',
    status: 'APPROVED',
    reference: ref,
    amount_in_cents: cents,
    currency: 'COP',
    customer_email: 'ana@example.com',
  });

  async function runProcess(
    trx: Record<string, unknown>,
    mockProvision?: (order: CheckoutOrder, transactionId: string) => Promise<SkillCertProvisionResult>,
  ) {
    return processWompiTransactionUpdate(trx, {
      ...repo,
      provisionSkillCert: mockProvision ?? provisionMock,
    });
  }

  async function provisionMock() {
    provisionCalls += 1;
    return { ok: true as const, status: 'provisioned' as const };
  }

  it('7. APPROVED without order does not provision', async () => {
    provisionCalls = 0;
    await runProcess(trxApproved('ss-renaser-missing'));
    assert.equal(provisionCalls, 0);
  });

  it('8. amount mismatch does not provision', async () => {
    provisionCalls = 0;
    const ref = 'ss-renaser-amt';
    await repo.putPendingCheckoutOrder({ ...baseOrder({ reference: ref }) });
    await runProcess(trxApproved(ref, 100));
    assert.equal(provisionCalls, 0);
  });

  it('9. currency mismatch does not provision', async () => {
    const order = baseOrder({ reference: 'ss-renaser-cur' });
    const v = validateRenaserApprovedPayment(order, {
      status: 'APPROVED',
      amount_in_cents: 25000000,
      currency: 'USD',
    });
    assert.equal(v.ok, false);
  });

  it('10. non-RenaSER productId does not provision SkillCert', async () => {
    provisionCalls = 0;
    const ref = 'ss-renaser-other';
    await repo.putPendingCheckoutOrder({
      ...baseOrder({ reference: ref, productId: '99999' }),
    });
    await runProcess(trxApproved(ref));
    assert.equal(provisionCalls, 0);
  });

  it('11. APPROVED RenaSER provisions SkillCert', async () => {
    provisionCalls = 0;
    const ref = 'ss-renaser-ok';
    await repo.putPendingCheckoutOrder({ ...baseOrder({ reference: ref }) });
    const r = await runProcess(trxApproved(ref));
    assert.equal(provisionCalls, 1);
    assert.equal(r.provisioned, true);
    const updated = await repo.getCheckoutOrderByReference(ref);
    assert.equal(updated?.provisioningStatus, 'COMPLETED');
  });

  it('12. duplicate webhook does not reprovision', async () => {
    provisionCalls = 0;
    const ref = 'ss-renaser-dup';
    await repo.putPendingCheckoutOrder({ ...baseOrder({ reference: ref }) });
    await runProcess(trxApproved(ref));
    await runProcess(trxApproved(ref));
    assert.equal(provisionCalls, 1);
  });

  it('13. SkillCert already_provisioned marks COMPLETED', async () => {
    provisionCalls = 0;
    const ref = 'ss-renaser-already';
    await repo.putPendingCheckoutOrder({ ...baseOrder({ reference: ref }) });
    await runProcess(trxApproved(ref), async () => {
      provisionCalls += 1;
      return { ok: true, status: 'already_provisioned' };
    });
    const updated = await repo.getCheckoutOrderByReference(ref);
    assert.equal(updated?.provisioningStatus, 'COMPLETED');
  });

  it('14. SkillCert failure sets FAILED', async () => {
    const ref = 'ss-renaser-fail';
    await repo.putPendingCheckoutOrder({ ...baseOrder({ reference: ref }) });
    await runProcess(trxApproved(ref), async () => ({
      ok: false,
      status: 500,
      error: 'upstream_error',
    }));
    const updated = await repo.getCheckoutOrderByReference(ref);
    assert.equal(updated?.provisioningStatus, 'FAILED');
    assert.ok(updated?.provisioningError);
  });
});

describe('Novena separation', () => {
  it('15. legacy reference still allows Novena path', () => {
    assert.equal(shouldSendNovenaDigitalFulfillment('ss-prod-abc', null), true);
  });

  it('16. RenaSER reference never triggers Novena template path', () => {
    assert.equal(shouldSendNovenaDigitalFulfillment('ss-renaser-uuid', null), false);
    assert.equal(
      shouldSendNovenaDigitalFulfillment('ss-prod-x', baseOrder()),
      false,
    );
  });
});

describe('SkillCert HMAC', () => {
  it('signs timestamp.nonce.body', () => {
    const sig = signSkillCertRequest('{"a":1}', '1700000000', 'nonce-1', 'secret');
    assert.equal(sig, crypto.createHmac('sha256', 'secret').update('1700000000.nonce-1.{"a":1}', 'utf8').digest('hex'));
  });
});
