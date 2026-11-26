import { sendOrderConfirmationEmail } from '@/src/lib/email/sendOrderConfirmation';
import type { DigitalFulfillmentInput } from '@/src/lib/wompi/digitalFulfillment';
import {
  getCaminoBiblicoProductDisplayName,
  resolveCaminoBiblicoPdfUrl,
} from './product';

/** Correo post-compra del e-book (PDF o aviso de envío en horas siguientes). */
export async function sendCaminoBiblicoFulfillmentEmail(
  input: DigitalFulfillmentInput,
): Promise<{ sent: boolean; error?: string; emailId?: string }> {
  const email = input.email.trim();
  if (!email.includes('@')) {
    return { sent: false, error: 'invalid_email' };
  }

  const productName = getCaminoBiblicoProductDisplayName();
  const pdfUrl = resolveCaminoBiblicoPdfUrl();

  if (pdfUrl) {
    return sendOrderConfirmationEmail({
      email,
      fullName: input.fullName,
      reference: input.reference || input.transactionId,
      transactionId: input.transactionId,
      amountInCents: input.amountInCents,
      status: 'APPROVED',
      fulfillmentTemplate: 'digital_download',
      productName,
      pdfDownloadUrl: pdfUrl,
      subjectOverride: `Tu e-book — ${productName}`,
      downloadButtonLabel: 'Descargar el e-book (PDF)',
    });
  }

  return sendOrderConfirmationEmail({
    email,
    fullName: input.fullName,
    reference: input.reference || input.transactionId,
    transactionId: input.transactionId,
    amountInCents: input.amountInCents,
    status: 'APPROVED',
    subjectOverride: `Compra recibida — ${productName}`,
    productSummary: `Recibimos tu pago por ${productName}. En las próximas horas te enviaremos el e-book a este correo.`,
  });
}