import type { NextApiRequest } from 'next';
import type { CheckoutDTO } from '@/src/infrastructure/DTOs/Checkout/CheckoutDTO';
import {
  getMemoriasCongresoCourseId,
  getMemoriasCongresoCourseSlug,
  getMemoriasCongresoPrice,
  getMemoriasCongresoSinglePurchaseCheckoutError,
  isMemoriasCongresoCheckoutItem,
} from '@/src/lib/shop/memoriasCongresoCourse';
import { normalizeInvitationEmail } from '@/src/lib/renaserInvitations/email';

export const RENSER_CANONICAL_PRODUCT_ID = String(getMemoriasCongresoCourseId());

/** SkillCert product slug (aula). */
export const SKILLCERT_RENASER_PRODUCT_ID = 'renaser-2026';

export type RenaserPricingMode = 'PUBLIC';

export type RenaserServerPricing = {
  basePriceCop: number;
  baseAmountInCents: number;
  discountPercent: number;
  discountAmountCop: number;
  discountAmountInCents: number;
  finalPriceCop: number;
  finalAmountInCents: number;
  pricingMode: RenaserPricingMode;
  benefitAmountInCents: number;
};

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

export function getRenaserPublicPricing(): RenaserServerPricing {
  const base = getRenaserPriceCop();
  const baseCents = getRenaserAmountInCents();
  return {
    basePriceCop: base,
    baseAmountInCents: baseCents,
    discountPercent: 0,
    discountAmountCop: 0,
    discountAmountInCents: 0,
    finalPriceCop: base,
    finalAmountInCents: baseCents,
    pricingMode: 'PUBLIC',
    benefitAmountInCents: 0,
  };
}

/** @deprecated Sin tarifa asistente; mismo precio público. */
export function getRenaserAttendeePricing(): RenaserServerPricing {
  return getRenaserPublicPricing();
}

/** @deprecated Use getRenaserPublicPricing */
export function getRenaserInvitedPricing(): RenaserServerPricing {
  return getRenaserPublicPricing();
}

/** @deprecated Solo existe precio PUBLIC. */
export function getRenaserServerPricingForMode(_mode?: RenaserPricingMode): RenaserServerPricing {
  return getRenaserPublicPricing();
}

/** @deprecated Use getRenaserPublicPricing */
export function getRenaserServerPricing(): RenaserServerPricing {
  return getRenaserPublicPricing();
}

export function validateRenaserClientTotalPrice(clientTotalCop: number): boolean {
  return clientTotalCop === getRenaserPublicPricing().finalPriceCop;
}

export type ResolveRenaserCheckoutPricingResult =
  | {
      ok: true;
      pricing: RenaserServerPricing;
      firstName: string;
      lastName: string;
      emailNormalized: string;
    }
  | { ok: false; httpStatus: number; error: string };

/** Fuente de verdad: siempre 250.000 COP; el total del cliente debe coincidir. */
export async function resolveRenaserCheckoutPricing(
  _req: NextApiRequest,
  formEmail: string,
  clientTotalCop: number,
  _orderReference: string,
): Promise<ResolveRenaserCheckoutPricingResult> {
  const pricing = getRenaserPublicPricing();
  const emailNormalized = normalizeInvitationEmail(formEmail);

  if (clientTotalCop !== pricing.finalPriceCop) {
    return { ok: false, httpStatus: 400, error: 'Invalid RenaSER total price' };
  }

  return {
    ok: true,
    pricing,
    firstName: '',
    lastName: '',
    emailNormalized,
  };
}

export function buildRenaserPendingOrderFields(
  form: CheckoutDTO['form'],
  pricing: RenaserServerPricing,
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
    pricingMode: pricing.pricingMode,
    baseAmountInCents: pricing.baseAmountInCents,
    benefitAmountInCents: 0,
    discountPercent: 0,
    discountAmountInCents: 0,
  };
}
