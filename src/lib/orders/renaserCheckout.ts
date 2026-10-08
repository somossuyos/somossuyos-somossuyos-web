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
import { isRenaserInvitationFeatureEnabled } from '@/src/lib/renaserInvitations/config';
import { assertRenaserInvitationCheckout } from '@/src/lib/renaserInvitations/checkoutGuard';
import { normalizeInvitationEmail } from '@/src/lib/renaserInvitations/email';

export const RENSER_CANONICAL_PRODUCT_ID = String(getMemoriasCongresoCourseId());

/** SkillCert product slug (aula). */
export const SKILLCERT_RENASER_PRODUCT_ID = 'renaser-2026';

export type RenaserPricingMode = 'PUBLIC' | 'INVITED';

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

export function getRenaserInvitedPricing(): RenaserServerPricing {
  const invited = calculateRenaserInvitationPricing();
  return {
    ...invited,
    pricingMode: 'INVITED',
    benefitAmountInCents: invited.discountAmountInCents,
  };
}

/** Precio servidor según modo (backend-only). */
export function getRenaserServerPricingForMode(mode: RenaserPricingMode): RenaserServerPricing {
  return mode === 'INVITED' ? getRenaserInvitedPricing() : getRenaserPublicPricing();
}

/** @deprecated Infer mode explicitly via resolveRenaserCheckoutPricing. */
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
      invitation?: { tokenHash: string; emailNormalized: string };
      firstName: string;
      lastName: string;
      emailNormalized: string;
    }
  | { ok: false; httpStatus: number; error: string };

/**
 * Fuente de verdad: total del cliente elige PUBLIC vs INVITED;
 * el camino invitado exige invitación válida en sesión.
 */
export async function resolveRenaserCheckoutPricing(
  req: NextApiRequest,
  formEmail: string,
  clientTotalCop: number,
  orderReference: string,
): Promise<ResolveRenaserCheckoutPricingResult> {
  const publicPricing = getRenaserPublicPricing();
  const invitedPricing = getRenaserInvitedPricing();

  if (clientTotalCop === publicPricing.finalPriceCop) {
    return {
      ok: true,
      pricing: publicPricing,
      firstName: '',
      lastName: '',
      emailNormalized: normalizeInvitationEmail(formEmail),
    };
  }

  if (clientTotalCop !== invitedPricing.finalPriceCop) {
    return { ok: false, httpStatus: 400, error: 'Invalid RenaSER total price' };
  }

  if (!isRenaserInvitationFeatureEnabled()) {
    return { ok: false, httpStatus: 400, error: 'Invalid RenaSER total price' };
  }

  const invitationGuard = await assertRenaserInvitationCheckout(req, formEmail, orderReference);
  if (!invitationGuard.ok) {
    return {
      ok: false,
      httpStatus: invitationGuard.httpStatus,
      error: invitationGuard.error,
    };
  }

  return {
    ok: true,
    pricing: invitedPricing,
    invitation: {
      tokenHash: invitationGuard.tokenHash,
      emailNormalized: invitationGuard.emailNormalized,
    },
    firstName: invitationGuard.firstName,
    lastName: invitationGuard.lastName,
    emailNormalized: invitationGuard.emailNormalized,
  };
}

export function buildRenaserPendingOrderFields(
  form: CheckoutDTO['form'],
  pricing: RenaserServerPricing,
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
    pricingMode: pricing.pricingMode,
    baseAmountInCents: pricing.baseAmountInCents,
    benefitAmountInCents: pricing.benefitAmountInCents,
    discountPercent: pricing.discountPercent,
    discountAmountInCents: pricing.discountAmountInCents,
    ...(invitation?.tokenHash ? { invitationTokenHash: invitation.tokenHash } : {}),
    ...(invitation?.emailNormalized
      ? { invitationEmailNormalized: invitation.emailNormalized }
      : {}),
  };
}
