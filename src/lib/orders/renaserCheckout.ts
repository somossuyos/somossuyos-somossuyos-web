import type { NextApiRequest } from 'next';
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
import { isBenefitSessionActive } from '@/src/lib/renaserBenefit/session';
import { normalizeInvitationEmail } from '@/src/lib/renaserInvitations/email';

export const RENSER_CANONICAL_PRODUCT_ID = String(getMemoriasCongresoCourseId());

/** SkillCert product slug (aula). */
export const SKILLCERT_RENASER_PRODUCT_ID = 'renaser-2026';

export type RenaserPricingMode = 'PUBLIC' | 'ATTENDEE';

export type RenaserServerPricing = RenaserInvitationPricing & {
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

export function getRenaserAttendeePricing(): RenaserServerPricing {
  const attendee = calculateRenaserInvitationPricing();
  return {
    ...attendee,
    pricingMode: 'ATTENDEE',
    benefitAmountInCents: attendee.discountAmountInCents,
  };
}

/** @deprecated Use getRenaserAttendeePricing */
export function getRenaserInvitedPricing(): RenaserServerPricing {
  return getRenaserAttendeePricing();
}

export function getRenaserServerPricingForMode(mode: RenaserPricingMode): RenaserServerPricing {
  return mode === 'ATTENDEE' ? getRenaserAttendeePricing() : getRenaserPublicPricing();
}

/** @deprecated Infer mode via resolveRenaserCheckoutPricing. */
export function getRenaserServerPricing(): RenaserServerPricing {
  return getRenaserPublicPricing();
}

export function validateRenaserClientTotalPrice(
  clientTotalCop: number,
  mode: RenaserPricingMode,
): boolean {
  const pricing = getRenaserServerPricingForMode(mode);
  return clientTotalCop === pricing.finalPriceCop;
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

/**
 * Fuente de verdad: total del cliente + cookie renaser_benefit (enlace compartido).
 * No usa invitaciones Dynamo ni /invitation/exchange.
 */
export async function resolveRenaserCheckoutPricing(
  req: NextApiRequest,
  formEmail: string,
  clientTotalCop: number,
  _orderReference: string,
): Promise<ResolveRenaserCheckoutPricingResult> {
  const publicPricing = getRenaserPublicPricing();
  const attendeePricing = getRenaserAttendeePricing();
  const emailNormalized = normalizeInvitationEmail(formEmail);

  if (clientTotalCop === publicPricing.finalPriceCop) {
    return {
      ok: true,
      pricing: publicPricing,
      firstName: '',
      lastName: '',
      emailNormalized,
    };
  }

  if (clientTotalCop !== attendeePricing.finalPriceCop) {
    return { ok: false, httpStatus: 400, error: 'Invalid RenaSER total price' };
  }

  if (!isBenefitSessionActive(req.headers.cookie)) {
    return { ok: false, httpStatus: 403, error: 'Invalid RenaSER total price' };
  }

  return {
    ok: true,
    pricing: attendeePricing,
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
    benefitAmountInCents: pricing.benefitAmountInCents,
    discountPercent: pricing.discountPercent,
    discountAmountInCents: pricing.discountAmountInCents,
  };
}
