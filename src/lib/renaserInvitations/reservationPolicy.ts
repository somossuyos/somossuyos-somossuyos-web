import type { CheckoutOrderStatus } from '@/src/lib/orders/types';
import type { RenaserPurchaseInvitation } from './types';
import { isReservationActive } from './invitationLogic';

export type ReserveDecision =
  | { action: 'allow'; mode: 'same_reference' | 'from_available' | 'after_terminal_order' }
  | { action: 'deny'; reason: string };

export function isCheckoutOrderTerminal(status: CheckoutOrderStatus | null | undefined): boolean {
  if (!status) return false;
  return status === 'DECLINED' || status === 'ERROR' || status === 'VOIDED';
}

/**
 * Decide if a new Wompi orderReference may be bound to this invitation.
 * Prevents a second payable checkout while a prior order is still PENDING (late Wompi window).
 */
export function decideCheckoutReservation(
  inv: RenaserPurchaseInvitation,
  requestedReference: string,
  priorOrderStatus: CheckoutOrderStatus | null | undefined,
  nowMs = Date.now(),
): ReserveDecision {
  if (inv.status === 'PURCHASED') {
    return { action: 'deny', reason: 'purchased' };
  }
  if (inv.status === 'DISABLED') {
    return { action: 'deny', reason: 'disabled' };
  }

  if (inv.status === 'AVAILABLE') {
    return { action: 'allow', mode: 'from_available' };
  }

  if (inv.status !== 'CHECKOUT_STARTED') {
    return { action: 'deny', reason: 'unavailable' };
  }

  const currentRef = inv.orderReference?.trim() ?? '';
  if (!currentRef) {
    return { action: 'allow', mode: 'from_available' };
  }

  if (currentRef === requestedReference.trim()) {
    return { action: 'allow', mode: 'same_reference' };
  }

  if (isReservationActive(inv, nowMs)) {
    return { action: 'deny', reason: 'concurrent_checkout' };
  }

  if (priorOrderStatus === 'APPROVED') {
    return { action: 'deny', reason: 'prior_order_approved' };
  }

  if (priorOrderStatus === 'PENDING' || priorOrderStatus == null) {
    return { action: 'deny', reason: 'pending_previous_order' };
  }

  if (isCheckoutOrderTerminal(priorOrderStatus)) {
    return { action: 'allow', mode: 'after_terminal_order' };
  }

  return { action: 'deny', reason: 'pending_previous_order' };
}

export type ConsumeDecision =
  | { action: 'allow'; mode: 'first_purchase' | 'idempotent_repeat' }
  | { action: 'deny'; reason: string };

/** APPROVED webhook: only the bound orderReference may consume the invitation. */
export function decideInvitationConsume(
  inv: RenaserPurchaseInvitation,
  orderReference: string,
  emailNormalized: string,
): ConsumeDecision {
  if (inv.emailNormalized !== emailNormalized) {
    return { action: 'deny', reason: 'email_mismatch' };
  }
  if (inv.status === 'PURCHASED') {
    if (inv.orderReference === orderReference) {
      return { action: 'allow', mode: 'idempotent_repeat' };
    }
    return { action: 'deny', reason: 'purchased_other_order' };
  }
  if (inv.status !== 'CHECKOUT_STARTED') {
    return { action: 'deny', reason: 'not_in_checkout' };
  }
  if (inv.orderReference !== orderReference) {
    return { action: 'deny', reason: 'order_reference_mismatch' };
  }
  return { action: 'allow', mode: 'first_purchase' };
}
