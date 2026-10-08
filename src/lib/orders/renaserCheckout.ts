import type { CheckoutDTO } from '@/src/infrastructure/DTOs/Checkout/CheckoutDTO';
import {
  getMemoriasCongresoCourseId,
  getMemoriasCongresoCourseSlug,
  getMemoriasCongresoPrice,
  getMemoriasCongresoSinglePurchaseCheckoutError,
  isMemoriasCongresoCheckoutItem,
} from '@/src/lib/shop/memoriasCongresoCourse';
import {
  calculateRenaserInvitationPricing,
  type RenaserInvitationPricing,
} from '@/src/lib/renaserInvitations/pricing';
import { isInvitationEnforcementEnabled } from '@/src/lib/renaserInvitations/config';

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
  if (isInvitationEnforcementEnabled()) {
    const invited = calculateRenaserInvitationPricing();
    return clientTotalCop === invited.finalPriceCop;
  }
  return clientTotalCop === getRenaserPriceCop();
}

export function getRenaserServerPricing(): RenaserInvitationPricing {
  if (isInvitationEnforcementEnabled()) {
    return calculateRenaserInvitationPricing();
  }
  const base = getRenaserPriceCop();
  return {
    basePriceCop: base,
    baseAmountInCents: getRenaserAmountInCents(),
    discountPercent: 0,
    discountAmountCop: 0,
    discountAmountInCents: 0,
    finalPriceCop: base,
    finalAmountInCents: getRenaserAmountInCents(),
  };
}

export function buildRenaserPendingOrderFields(
  form: CheckoutDTO['form'],
  pricing: RenaserInvitationPricing,
  invitation?: { tokenHash: string; emailNormalized: string },
) {
  return {
    productId: RENSER_CANONICAL_PRODUCT_ID,
    productSlug: getMemoriasCongresoCourseSlug(),
    firstName: form.names?.trim() ?? '',
    lastName: form.lastNames?.trim() ?? '',
    email: form.email.trim().toLowerCase(),
    phone: form.phone?.trim() ?? '',
    amountInCents: pricing.finalAmountInCents,
    currency: 'COP' as const,
    baseAmountInCents: pricing.baseAmountInCents,
    discountPercent: pricing.discountPercent,
    discountAmountInCents: pricing.discountAmountInCents,
    ...(invitation?.tokenHash ? { invitationTokenHash: invitation.tokenHash } : {}),
    ...(invitation?.emailNormalized
      ? { invitationEmailNormalized: invitation.emailNormalized }
      : {}),
  };
}
