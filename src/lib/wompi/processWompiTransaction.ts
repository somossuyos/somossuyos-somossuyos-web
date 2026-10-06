import type { CheckoutOrdersStore } from '@/src/lib/orders/checkoutOrdersStore.types';
import type { SkillCertProvisionResult } from '@/src/lib/skillcert/provision';
import { RENSER_CANONICAL_PRODUCT_ID } from '@/src/lib/orders/renaserCheckout';
import type { CheckoutOrderStatus } from '@/src/lib/orders/types';
import { provisionSkillCertAccess } from '@/src/lib/skillcert/provision';
import {
  digitalFulfillmentFromWompiTransaction,
  sendDigitalFulfillmentEmail,
} from './digitalFulfillment';
import { sendRenaserPurchaseConfirmationEmail } from '@/src/lib/email/sendRenaserConfirmation';
import {
  shouldSendNovenaDigitalFulfillment,
  validateRenaserApprovedPayment,
} from './renaserPaymentValidation';
import { str } from './webhookStrings';

export type ProcessTransactionDeps = CheckoutOrdersStore & {
  provisionSkillCert?: (
    order: import('@/src/lib/orders/types').CheckoutOrder,
    transactionId: string,
  ) => Promise<SkillCertProvisionResult>;
};

function mapWompiStatus(statusRaw: string): CheckoutOrderStatus | null {
  const s = statusRaw.toUpperCase();
  if (s === 'APPROVED') return 'APPROVED';
  if (s === 'DECLINED') return 'DECLINED';
  if (s === 'VOIDED') return 'VOIDED';
  if (s === 'ERROR') return 'ERROR';
  return null;
}

export async function processWompiTransactionUpdate(
  trx: Record<string, unknown> | undefined,
  deps: ProcessTransactionDeps,
): Promise<{ novenaEmailSent?: boolean; renaSerEmailSent?: boolean; provisioned?: boolean }> {
  const result: { novenaEmailSent?: boolean; renaSerEmailSent?: boolean; provisioned?: boolean } = {};

  if (!trx) return result;

  const statusRaw = str(trx.status).toUpperCase();
  const reference = str(trx.reference);
  const trxId = str(trx.id);

  const mapped = mapWompiStatus(statusRaw);
  const order = reference ? await deps.getCheckoutOrderByReference(reference) : null;

  if (mapped && reference) {
    await deps.updateCheckoutOrderStatus(reference, mapped, trxId || undefined);
  }

  if (statusRaw !== 'APPROVED') {
    return result;
  }

  if (!order) {
    if (reference) {
      console.warn('[wompi/process] APPROVED sin orden persistida', { reference: reference.slice(0, 24) });
    }
    if (shouldSendNovenaDigitalFulfillment(reference, null)) {
      const fulfillment = digitalFulfillmentFromWompiTransaction(trx, trxId || reference || 'unknown');
      if (fulfillment) {
        const r = await sendDigitalFulfillmentEmail(fulfillment);
        result.novenaEmailSent = r.sent;
      }
    }
    return result;
  }

  if (order.productId === RENSER_CANONICAL_PRODUCT_ID) {
    const validation = validateRenaserApprovedPayment(order, trx);
    if (!validation.ok) {
      console.warn('[wompi/process] RenaSER validation failed', {
        reference: order.reference,
        reason: validation.reason,
      });
      return result;
    }

    const started = await deps.tryMarkProvisioningProcessing(order.reference);
    if (!started) {
      console.info('[wompi/process] provisioning skip (already processing or completed)', {
        reference: order.reference,
      });
      return result;
    }

    const provision = deps.provisionSkillCert ?? provisionSkillCertAccess;
    const provResult = await provision(order, trxId);

    if (provResult.ok) {
      await deps.markProvisioningCompleted(order.reference);
      result.provisioned = true;

      const emailResult = await sendRenaserPurchaseConfirmationEmail({
        email: order.email,
        firstName: order.firstName,
        lastName: order.lastName,
        reference: order.reference,
        transactionId: trxId,
      });
      result.renaSerEmailSent = emailResult.sent;
    } else {
      await deps.markProvisioningFailed(order.reference, provResult.error);
      console.error('[wompi/process] SkillCert provision failed', {
        reference: order.reference,
        status: provResult.status,
      });
    }

    return result;
  }

  if (shouldSendNovenaDigitalFulfillment(reference, order)) {
    const fulfillment = digitalFulfillmentFromWompiTransaction(trx, trxId || reference);
    if (fulfillment) {
      const r = await sendDigitalFulfillmentEmail(fulfillment);
      result.novenaEmailSent = r.sent;
    }
  }

  return result;
}
