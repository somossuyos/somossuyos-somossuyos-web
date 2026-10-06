import { sendOrderConfirmationEmail } from './sendOrderConfirmation';

export type RenaserConfirmationInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  reference: string;
  transactionId: string;
};

export async function sendRenaserPurchaseConfirmationEmail(
  input: RenaserConfirmationInput,
): Promise<{ sent: boolean; error?: string; emailId?: string }> {
  const fullName = [input.firstName, input.lastName].filter(Boolean).join(' ').trim();

  return sendOrderConfirmationEmail({
    email: input.email,
    fullName: fullName || undefined,
    reference: input.reference,
    transactionId: input.transactionId,
    status: 'APPROVED',
    fulfillmentTemplate: 'renaser_purchase_confirmed',
    subjectOverride: 'Tu compra de RenaSER 2026 fue confirmada',
  });
}
