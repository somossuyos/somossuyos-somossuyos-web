import { sendOrderConfirmationEmail } from '@/src/lib/email/sendOrderConfirmation';
import { customerFullNameFromWompiTransaction, productLabelFromWompiTransaction } from './webhookTransactionMeta';

export type DigitalFulfillmentInput = {
  transactionId: string;
  email: string;
  reference: string;
  fullName?: string;
  amountInCents?: number;
  productName?: string;
};

/** Envía el correo con enlace al PDF tras pago APPROVED. */
export async function sendDigitalFulfillmentEmail(
  input: DigitalFulfillmentInput,
): Promise<{ sent: boolean; error?: string }> {
  const email = input.email.trim();
  if (!email.includes('@')) {
    return { sent: false, error: 'invalid_email' };
  }

  return sendOrderConfirmationEmail({
    email,
    fullName: input.fullName,
    reference: input.reference || input.transactionId,
    transactionId: input.transactionId,
    amountInCents: input.amountInCents,
    status: 'APPROVED',
    fulfillmentTemplate: 'digital_download',
    ...(input.productName ? { productName: input.productName } : {}),
  });
}

/** Construye payload de fulfillment desde el objeto transaction del webhook/API Wompi. */
export function digitalFulfillmentFromWompiTransaction(
  trx: Record<string, unknown> | undefined,
  trxId: string,
): DigitalFulfillmentInput | null {
  if (!trx) return null;

  const rawEmail = trx.customer_email ?? trx.customerEmail;
  const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';
  if (!email) return null;

  const reference =
    typeof trx.reference === 'string' && trx.reference.trim()
      ? trx.reference.trim()
      : trxId;

  const amt =
    typeof trx.amount_in_cents !== 'undefined' ? Number(trx.amount_in_cents) : undefined;

  return {
    transactionId: trxId,
    email,
    reference,
    fullName: customerFullNameFromWompiTransaction(trx) || undefined,
    amountInCents: Number.isFinite(amt) ? amt : undefined,
    productName: productLabelFromWompiTransaction(trx),
  };
}
