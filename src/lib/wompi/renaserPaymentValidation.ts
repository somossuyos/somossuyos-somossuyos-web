import { RENSER_CANONICAL_PRODUCT_ID } from '@/src/lib/orders/renaserCheckout';
import type { CheckoutOrder } from '@/src/lib/orders/types';
import { str } from './webhookStrings';

export type RenaserValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

export function validateRenaserApprovedPayment(
  order: CheckoutOrder,
  trx: Record<string, unknown>,
): RenaserValidationResult {
  if (order.productId !== RENSER_CANONICAL_PRODUCT_ID) {
    return { ok: false, reason: 'product_id_mismatch' };
  }

  const status = str(trx.status).toUpperCase();
  if (status !== 'APPROVED') {
    return { ok: false, reason: 'status_not_approved' };
  }

  const trxAmount = Number(trx.amount_in_cents);
  if (!Number.isFinite(trxAmount) || trxAmount !== order.amountInCents) {
    return { ok: false, reason: 'amount_mismatch' };
  }

  const currency = str(trx.currency || 'COP').toUpperCase();
  const orderCurrency = (order.currency || 'COP').toUpperCase();
  if (currency !== orderCurrency) {
    return { ok: false, reason: 'currency_mismatch' };
  }

  return { ok: true };
}

export function shouldSendNovenaDigitalFulfillment(
  reference: string,
  order: CheckoutOrder | null,
): boolean {
  if (order?.productId === RENSER_CANONICAL_PRODUCT_ID) return false;
  if (reference.startsWith('ss-renaser-')) return false;
  return true;
}
