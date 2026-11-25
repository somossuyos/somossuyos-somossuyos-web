import { CAMINO_CREDIT_CARD_SURCHARGE_RATE } from './paymentPlans';

export type CaminoPaymentChannel = 'credit_card' | 'other';

/** Euros → pesos COP redondeados (Wompi Colombia). */
export function eurToCopPesos(amountEur: number, rate: number): number {
  return Math.round(amountEur * rate);
}

/** Pesos COP → centavos Wompi (×100). */
export function copPesosToAmountInCents(copPesos: number): number {
  return Math.round(copPesos * 100);
}

export function applyPaymentChannelSurcharge(
  copPesos: number,
  channel: CaminoPaymentChannel,
): { copPesos: number; surchargeCop: number } {
  if (channel !== 'credit_card') {
    return { copPesos, surchargeCop: 0 };
  }
  const surchargeCop = Math.round(copPesos * CAMINO_CREDIT_CARD_SURCHARGE_RATE);
  return { copPesos: copPesos + surchargeCop, surchargeCop };
}

export function resolveCaminoChargeWithRate(
  amountEur: number,
  channel: CaminoPaymentChannel,
  eurToCopRate: number,
): { amountInCents: number; copPesos: number; surchargeCop: number; baseCop: number } {
  const baseCop = eurToCopPesos(amountEur, eurToCopRate);
  const { copPesos, surchargeCop } = applyPaymentChannelSurcharge(baseCop, channel);
  const amountInCents = copPesosToAmountInCents(copPesos);
  return { amountInCents, copPesos, surchargeCop, baseCop };
}