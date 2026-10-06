import { GetCheckoutDTO } from '@/src/infrastructure/DTOs/Checkout/GetCheckoutDTO';
import { checkoutRepository } from '@/src/infrastructure/repositories/checkout.repository';
import {
  getCheckoutOrderByReference,
  markProvisioningCompleted,
  markProvisioningFailed,
  tryMarkProvisioningProcessing,
  updateCheckoutOrderStatus,
} from '@/src/lib/orders/checkoutOrdersRepository';
import {
  digitalFulfillmentFromWompiTransaction,
  sendDigitalFulfillmentEmail,
} from './digitalFulfillment';
import { fetchWompiTransaction, normalizeWompiStatusForUi } from './fetchTransaction';
import { processWompiTransactionUpdate } from './processWompiTransaction';
import { RENSER_CANONICAL_PRODUCT_ID } from '@/src/lib/orders/renaserCheckout';
import { shouldSendNovenaDigitalFulfillment } from './renaserPaymentValidation';

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
    if (status === 'APPROVED') {
      const reference = wompi.reference ?? transactionId;
      const trxLike: Record<string, unknown> = {
        id: transactionId,
        status: 'APPROVED',
        customer_email: wompi.customerEmail,
        reference,
        amount_in_cents: wompi.amountInCents,
        currency: 'COP',
        customer_data: wompi.customerData,
      };

      const order = reference ? await getCheckoutOrderByReference(reference) : null;

      if (order?.productId === RENSER_CANONICAL_PRODUCT_ID) {
        const r = await processWompiTransactionUpdate(trxLike, {
          getCheckoutOrderByReference,
          updateCheckoutOrderStatus,
          tryMarkProvisioningProcessing,
          markProvisioningCompleted,
          markProvisioningFailed,
        });
        emailSent = r.renaSerEmailSent;
      } else if (wompi.customerEmail && shouldSendNovenaDigitalFulfillment(reference, order)) {
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
