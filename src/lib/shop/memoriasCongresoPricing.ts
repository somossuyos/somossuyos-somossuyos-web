import { DEFAULT_MEMORIAS_CONGRESO_PRICE, getMemoriasCongresoPrice } from './memoriasCongresoCourse';

/** Tier comercial; el precio efectivo lo define siempre el servidor. */
export type RenaserPurchaseTier = 'ATTENDEE' | 'GENERAL';

export const MEMORIAS_REGULAR_PRICE_COP = DEFAULT_MEMORIAS_CONGRESO_PRICE;

/** Precio especial asistentes: pendiente de definición de negocio (no usar en checkout). */
export const MEMORIAS_ATTENDEE_PRICE_COP: number | null = null;

export function getMemoriasRegularPriceCop(): number {
  return getMemoriasCongresoPrice();
}

/** Solo GENERAL tiene precio de checkout hoy; ATTENDEE requiere verificación server-side. */
export function getCheckoutPriceCopForTier(tier: RenaserPurchaseTier): number | null {
  if (tier === 'GENERAL') {
    return getMemoriasRegularPriceCop();
  }
  return MEMORIAS_ATTENDEE_PRICE_COP;
}
