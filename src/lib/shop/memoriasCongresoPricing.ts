import { DEFAULT_MEMORIAS_CONGRESO_PRICE, getMemoriasCongresoPrice } from './memoriasCongresoCourse';

/** Tier comercial; el precio efectivo lo define siempre el servidor. */
export type RenaserPurchaseTier = 'GENERAL';

export const MEMORIAS_REGULAR_PRICE_COP = DEFAULT_MEMORIAS_CONGRESO_PRICE;

export function getMemoriasRegularPriceCop(): number {
  return getMemoriasCongresoPrice();
}

export function getMemoriasListingFromPriceCop(): number {
  return getMemoriasRegularPriceCop();
}

export function getCheckoutPriceCopForTier(tier: RenaserPurchaseTier): number | null {
  if (tier === 'GENERAL') {
    return getMemoriasRegularPriceCop();
  }
  return null;
}
