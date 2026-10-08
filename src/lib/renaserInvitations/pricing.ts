import { getMemoriasCongresoPrice } from '@/src/lib/shop/memoriasCongresoCourse';

/** @deprecated Descuento RenaSER desactivado (precio único). */
export const RENASER_INVITATION_DISCOUNT_AMOUNT_COP = 0;

/** @deprecated Descuento RenaSER desactivado (precio único). */
export const RENASER_INVITATION_DISCOUNT_PERCENT = 0;

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

/** Precio único RenaSER 2026 (mismo que lista pública). */
export function calculateRenaserInvitationPricing(
  basePriceCop = getMemoriasCongresoPrice(),
): RenaserInvitationPricing {
  const safeBase = Math.max(0, Math.round(basePriceCop));
  return {
    basePriceCop: safeBase,
    baseAmountInCents: copToCents(safeBase),
    discountPercent: 0,
    discountAmountCop: 0,
    discountAmountInCents: 0,
    finalPriceCop: safeBase,
    finalAmountInCents: copToCents(safeBase),
  };
}

export function validateRenaserInvitedClientTotalPrice(clientTotalCop: number): boolean {
  const { finalPriceCop } = calculateRenaserInvitationPricing();
  return clientTotalCop === finalPriceCop;
}
