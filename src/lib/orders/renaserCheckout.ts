import type { CheckoutDTO } from '@/src/infrastructure/DTOs/Checkout/CheckoutDTO';
import {
  getMemoriasCongresoCourseId,
  getMemoriasCongresoCourseSlug,
  getMemoriasCongresoPrice,
  getMemoriasCongresoSinglePurchaseCheckoutError,
  isMemoriasCongresoCheckoutItem,
} from '@/src/lib/shop/memoriasCongresoCourse';

export const RENSER_CANONICAL_PRODUCT_ID = String(getMemoriasCongresoCourseId());

/** SkillCert product slug (aula). */
export const SKILLCERT_RENASER_PRODUCT_ID = 'renaser-2026';

export function isRenaserCheckout(items: CheckoutDTO['items'] | undefined): boolean {
  if (getMemoriasCongresoSinglePurchaseCheckoutError(items) != null) return false;
  if (!items?.length) return false;
  return items.some(isMemoriasCongresoCheckoutItem);
}

export function getRenaserPriceCop(): number {
  return getMemoriasCongresoPrice();
}

export function getRenaserAmountInCents(): number {
  return Math.round(getRenaserPriceCop() * 100);
}

/** Rechaza si el cliente envió un total distinto al precio servidor RenaSER. */
export function validateRenaserClientTotalPrice(clientTotalCop: number): boolean {
  return clientTotalCop === getRenaserPriceCop();
}

export function buildRenaserPendingOrderFields(form: CheckoutDTO['form']) {
  return {
    productId: RENSER_CANONICAL_PRODUCT_ID,
    productSlug: getMemoriasCongresoCourseSlug(),
    firstName: form.names?.trim() ?? '',
    lastName: form.lastNames?.trim() ?? '',
    email: form.email.trim(),
    phone: form.phone?.trim() ?? '',
    amountInCents: getRenaserAmountInCents(),
    currency: 'COP' as const,
  };
}
