import {
  getCheckoutOrderByReference,
  markProvisioningCompleted,
  markProvisioningFailed,
  tryMarkProvisioningRetry,
} from './checkoutOrdersRepository';
import { RENSER_CANONICAL_PRODUCT_ID } from './renaserCheckout';
import { provisionSkillCertAccess } from '@/src/lib/skillcert/provision';
import { sendRenaserPurchaseConfirmationEmail } from '@/src/lib/email/sendRenaserConfirmation';

export type RetryProvisioningResult =
  | { ok: true; outcome: 'provisioned' | 'already_provisioned' | 'skipped' }
  | { ok: false; error: string };

/**
 * Reintento manual/admin cuando status=APPROVED y provisioningStatus=FAILED.
 * No altera el estado de pago Wompi.
 */
export async function retryRenaserProvisioning(reference: string): Promise<RetryProvisioningResult> {
  const ref = reference?.trim();
  if (!ref) return { ok: false, error: 'missing_reference' };

  const order = await getCheckoutOrderByReference(ref);
  if (!order) return { ok: false, error: 'order_not_found' };
  if (order.productId !== RENSER_CANONICAL_PRODUCT_ID) {
    return { ok: false, error: 'not_renaser_product' };
  }
  if (order.status !== 'APPROVED') {
    return { ok: false, error: 'payment_not_approved' };
  }
  if (order.provisioningStatus === 'COMPLETED') {
    return { ok: true, outcome: 'skipped' };
  }

  const started = await tryMarkProvisioningRetry(ref);
  if (!started) {
    if (order.provisioningStatus === 'PROCESSING') {
      return { ok: true, outcome: 'skipped' };
    }
    return { ok: false, error: 'cannot_start_retry' };
  }

  const trxId = order.wompiTransactionId || ref;
  const provResult = await provisionSkillCertAccess(order, trxId);

  if (provResult.ok) {
    await markProvisioningCompleted(ref);
    await sendRenaserPurchaseConfirmationEmail({
      email: order.email,
      firstName: order.firstName,
      lastName: order.lastName,
      reference: ref,
      transactionId: trxId,
    });
    return {
      ok: true,
      outcome: provResult.status === 'already_provisioned' ? 'already_provisioned' : 'provisioned',
    };
  }

  await markProvisioningFailed(ref, provResult.error);
  return { ok: false, error: provResult.error };
}
