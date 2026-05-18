import { GetCheckoutDTO } from '@/src/infrastructure/DTOs/Checkout/GetCheckoutDTO';
import { checkoutRepository } from '@/src/infrastructure/repositories/checkout.repository';
import {
  digitalFulfillmentFromWompiTransaction,
  sendDigitalFulfillmentEmail,
} from './digitalFulfillment';
import { fetchWompiTransaction, normalizeWompiStatusForUi } from './fetchTransaction';

/**
 * Resuelve el estado del pago para /confirmacion-pago:
 * 1) API Wompi (fuente de verdad)
 * 2) CMS Strapi /transacciones (legacy, si existiera registro)
 *
 * Si el pago está APPROVED, intenta enviar el correo con el PDF (respaldo si el webhook falló).
 */
export async function resolvePaymentStatusForConfirmation(
  transactionId: string,
): Promise<{ status: string | null; source: 'wompi' | 'strapi' | 'none'; emailSent?: boolean }> {
  const wompi = await fetchWompiTransaction(transactionId);
  if (wompi.status) {
    const status = normalizeWompiStatusForUi(wompi.status);

    let emailSent: boolean | undefined;
    if (status === 'APPROVED' && wompi.customerEmail) {
      const trxLike: Record<string, unknown> = {
        customer_email: wompi.customerEmail,
        reference: wompi.reference ?? transactionId,
        amount_in_cents: wompi.amountInCents,
        customer_data: wompi.customerData,
      };
      const fulfillment = digitalFulfillmentFromWompiTransaction(trxLike, transactionId);
      if (fulfillment) {
        const r = await sendDigitalFulfillmentEmail(fulfillment);
        emailSent = r.sent;
        console.info('[confirmacion-pago] digital fulfillment', {
          transactionId,
          sent: r.sent,
          error: r.error ?? null,
        });
      }
    }

    return {
      status,
      source: 'wompi',
      emailSent,
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
