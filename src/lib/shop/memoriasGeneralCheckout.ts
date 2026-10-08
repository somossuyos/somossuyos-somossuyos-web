import {
  getMemoriasCongresoCourseId,
  getMemoriasCongresoPrice,
  MEMORIAS_CONGRESO_COVER_PATH,
} from './memoriasCongresoCourse';
import type { RenaserPurchaseTier } from './memoriasCongresoPricing';
import { getCheckoutPriceCopForTier } from './memoriasCongresoPricing';

export const MEMORIAS_CART_TITLE = 'Memoria en video del Congreso RenaSER 2026';

/** Ítem de carrito RenaSER; precio siempre el de lista (servidor valida en create-order). */
export function buildMemoriasCartItemForTier(tier: RenaserPurchaseTier) {
  if (tier !== 'GENERAL') {
    return null;
  }
  const price = getCheckoutPriceCopForTier('GENERAL');
  if (price == null || price !== getMemoriasCongresoPrice()) {
    return null;
  }
  return {
    id: getMemoriasCongresoCourseId(),
    thumbnail: MEMORIAS_CONGRESO_COVER_PATH,
    title: MEMORIAS_CART_TITLE,
    type: 'course' as const,
    price,
    quantity: 1,
    size: '',
    color: '',
    category: {
      name: 'Curso',
      shippingCost: 0,
    },
  };
}

/** @deprecated Mismo ítem que GENERAL (sin descuento). */
export function buildMemoriasCartItemForAttendee() {
  return buildMemoriasCartItemForTier('GENERAL');
}

/** @deprecated Use buildMemoriasCartItemForTier('GENERAL') */
export const buildMemoriasCartItemForInvitation = buildMemoriasCartItemForAttendee;

/** Rechaza intentos de bypass por query string en checkout RenaSER. */
export function isClientDiscountQueryBypass(searchParams: URLSearchParams): boolean {
  const keys = ['discount', 'price', 'tier', 'attendee'];
  return keys.some((key) => searchParams.has(key));
}
