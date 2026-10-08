import type { CheckoutOrder } from '@/src/lib/orders/types';
import {
  markInvitationPurchasedIdempotent,
  releaseInvitationReservation,
  type RenaserInvitationsRepository,
} from './repository';

type InvitationWebhookDeps = Pick<
  RenaserInvitationsRepository,
  'markInvitationPurchasedIdempotent' | 'releaseInvitationReservation'
>;

const defaultInvitationDeps: InvitationWebhookDeps = {
  markInvitationPurchasedIdempotent,
  releaseInvitationReservation,
};

export async function releaseInvitationIfPaymentFailed(
  order: CheckoutOrder | null,
  statusRaw: string,
  deps: InvitationWebhookDeps = defaultInvitationDeps,
): Promise<void> {
  if (!order?.reference || !order.invitationTokenHash) return;
  const fail = ['DECLINED', 'ERROR', 'VOIDED'].includes(statusRaw.toUpperCase());
  if (!fail) return;
  await deps.releaseInvitationReservation(order.reference);
}

export async function consumeInvitationOnApprovedPayment(
  order: CheckoutOrder,
  trxId: string,
  deps: InvitationWebhookDeps = defaultInvitationDeps,
): Promise<{ ok: true; already: boolean } | { ok: false }> {
  if (!order.invitationTokenHash) {
    return { ok: true, already: false };
  }
  const consume = await deps.markInvitationPurchasedIdempotent(
    order.invitationTokenHash,
    order.reference,
    trxId,
    order.email,
  );
  if (!consume.ok) return { ok: false };
  return { ok: true, already: consume.already };
}
