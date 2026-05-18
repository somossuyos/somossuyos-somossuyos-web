import { GetCheckoutDTO } from '@/src/infrastructure/DTOs/Checkout/GetCheckoutDTO';
import { checkoutRepository } from '@/src/infrastructure/repositories/checkout.repository';
import { fetchWompiTransactionStatus, normalizeWompiStatusForUi } from './fetchTransaction';

/**
 * Resuelve el estado del pago para /confirmacion-pago:
 * 1) API Wompi (fuente de verdad)
 * 2) CMS Strapi /transacciones (legacy, si existiera registro)
 */
export async function resolvePaymentStatusForConfirmation(
  transactionId: string,
): Promise<{ status: string | null; source: 'wompi' | 'strapi' | 'none' }> {
  const wompi = await fetchWompiTransactionStatus(transactionId);
  if (wompi.status) {
    return {
      status: normalizeWompiStatusForUi(wompi.status),
      source: 'wompi',
    };
  }

  try {
    const response = (await checkoutRepository.getCheckout(transactionId)) as GetCheckoutDTO;
    const cmsStatus = response.data?.[0]?.attributes?.Estado ?? null;
    if (cmsStatus) {
      return { status: normalizeWompiStatusForUi(cmsStatus), source: 'strapi' };
    }
  } catch (e) {
    console.warn('[resolvePaymentStatus] strapi fallback failed', e);
  }

  return { status: null, source: 'none' };
}
