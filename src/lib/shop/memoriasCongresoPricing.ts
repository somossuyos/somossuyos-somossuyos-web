import { DEFAULT_MEMORIAS_CONGRESO_PRICE, getMemoriasCongresoPrice } from './memoriasCongresoCourse';

/** Tier comercial; el precio efectivo lo define siempre el servidor. */
export type RenaserPurchaseTier = 'ATTENDEE' | 'GENERAL';

export const MEMORIAS_REGULAR_PRICE_COP = DEFAULT_MEMORIAS_CONGRESO_PRICE;

/** Tarifa asistentes (UI; checkout server-side pendiente de verificación). */
export const MEMORIAS_ATTENDEE_PRICE_COP = 150_000;

export function getMemoriasRegularPriceCop(): number {
  return getMemoriasCongresoPrice();
}

export function getMemoriasAttendeePriceCop(): number {
  return MEMORIAS_ATTENDEE_PRICE_COP;
}

/** Precio más bajo publicado en ficha (asistentes). */
export function getMemoriasListingFromPriceCop(): number {
  return getMemoriasAttendeePriceCop();
}

/** Solo GENERAL tiene checkout activo hoy; ATTENDEE requiere verificación server-side. */
export function getCheckoutPriceCopForTier(tier: RenaserPurchaseTier): number | null {
  if (tier === 'GENERAL') {
    return getMemoriasRegularPriceCop();
  }
  return null;
}
