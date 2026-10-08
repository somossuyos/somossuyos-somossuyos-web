import { getMemoriasCongresoPrice } from '@/src/lib/shop/memoriasCongresoCourse';

/** Beneficio fijo invitados RenaSER 2026 (enteros, backend-only). */
export const RENASER_INVITATION_DISCOUNT_AMOUNT_COP = 100_000;

/** Equivalente sobre precio lista 250.000 COP (solo comunicación). */
export const RENASER_INVITATION_DISCOUNT_PERCENT = 40;

export type RenaserInvitationPricing = {
  basePriceCop: number;
  baseAmountInCents: number;
  discountPercent: number;
  discountAmountCop: number;
  discountAmountInCents: number;
  finalPriceCop: number;
  finalAmountInCents: number;
};

function copToCents(cop: number): number {
  return Math.round(cop * 100);
}

/** Precio invitación: base 250.000 COP − 100.000 COP beneficio = 150.000 COP. */
export function calculateRenaserInvitationPricing(
  basePriceCop = getMemoriasCongresoPrice(),
): RenaserInvitationPricing {
  const safeBase = Math.max(0, Math.round(basePriceCop));
  const discountAmountCop = RENASER_INVITATION_DISCOUNT_AMOUNT_COP;
  const finalPriceCop = safeBase - discountAmountCop;
  return {
    basePriceCop: safeBase,
    baseAmountInCents: copToCents(safeBase),
    discountPercent: RENASER_INVITATION_DISCOUNT_PERCENT,
    discountAmountCop,
    discountAmountInCents: copToCents(discountAmountCop),
    finalPriceCop,
    finalAmountInCents: copToCents(finalPriceCop),
  };
}

export function validateRenaserInvitedClientTotalPrice(clientTotalCop: number): boolean {
  const { finalPriceCop } = calculateRenaserInvitationPricing();
  return clientTotalCop === finalPriceCop;
}
