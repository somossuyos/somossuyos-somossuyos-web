import { describe, expect, it } from 'vitest';
import { applyPaymentChannelSurcharge, eurToCopPesos, resolveCaminoChargeWithRate } from './caminoWompiPricing';

describe('caminoWompiPricing', () => {
  it('converts eur to cop', () => {
    expect(eurToCopPesos(1670, 4500)).toBe(7515000);
  });

  it('adds 6% for credit card', () => {
    const base = 1_000_000;
    const { copPesos, surchargeCop } = applyPaymentChannelSurcharge(base, 'credit_card');
    expect(surchargeCop).toBe(60_000);
    expect(copPesos).toBe(1_060_000);
  });

  it('single plan charge in cents', () => {
    const r = resolveCaminoChargeWithRate(1670, 'other', 4700);
    expect(r.amountInCents).toBe(1670 * 4700 * 100);
  });
});