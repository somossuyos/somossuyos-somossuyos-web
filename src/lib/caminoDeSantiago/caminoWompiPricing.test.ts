import assert from 'node:assert/strict';
import test from 'node:test';
import { applyPaymentChannelSurcharge, eurToCopPesos, resolveCaminoChargeWithRate } from './caminoWompiPricing';

test('converts eur to cop', () => {
  assert.equal(eurToCopPesos(1670, 4500), 7515000);
});

test('adds 6% for credit card', () => {
  const base = 1_000_000;
  const { copPesos, surchargeCop } = applyPaymentChannelSurcharge(base, 'credit_card');
  assert.equal(surchargeCop, 60_000);
  assert.equal(copPesos, 1_060_000);
});

test('single plan charge in cents', () => {
  const r = resolveCaminoChargeWithRate(1670, 'other', 4700);
  assert.equal(r.amountInCents, 1670 * 4700 * 100);
});