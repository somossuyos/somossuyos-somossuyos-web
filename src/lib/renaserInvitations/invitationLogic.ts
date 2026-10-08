import type { RenaserPurchaseInvitation } from './types';
import { GENERIC_INVITATION_ERROR } from './config';

export function isInvitationExpired(inv: RenaserPurchaseInvitation, now = Date.now()): boolean {
  if (!inv.expiresAt) return false;
  const t = Date.parse(inv.expiresAt);
  return Number.isFinite(t) && t < now;
}

export function isReservationActive(inv: RenaserPurchaseInvitation, now = Date.now()): boolean {
  if (inv.status !== 'CHECKOUT_STARTED') return false;
  if (!inv.reservationExpiresAt) return true;
  const t = Date.parse(inv.reservationExpiresAt);
  return Number.isFinite(t) && t > now;
}

export function canStartCheckout(inv: RenaserPurchaseInvitation, now = Date.now()): boolean {
  if (inv.status === 'DISABLED') return false;
  if (inv.status === 'PURCHASED') return false;
  if (isInvitationExpired(inv, now)) return false;
  if (inv.status === 'AVAILABLE') return true;
  if (inv.status === 'CHECKOUT_STARTED') {
    if (!isReservationActive(inv, now)) return true;
    return true;
  }
  return false;
}

export type InvitationLookupResult =
  | { ok: true; invitation: RenaserPurchaseInvitation }
  | { ok: false; code: 'not_found' | 'expired' | 'disabled' | 'purchased' | 'unavailable'; message: string };

export function evaluateInvitationForAccess(
  inv: RenaserPurchaseInvitation | null,
): InvitationLookupResult {
  if (!inv) {
    return { ok: false, code: 'not_found', message: GENERIC_INVITATION_ERROR };
  }
  if (inv.status === 'DISABLED') {
    return { ok: false, code: 'disabled', message: GENERIC_INVITATION_ERROR };
  }
  if (isInvitationExpired(inv)) {
    return { ok: false, code: 'expired', message: GENERIC_INVITATION_ERROR };
  }
  if (inv.status === 'PURCHASED') {
    return {
      ok: false,
      code: 'purchased',
      message: 'Esta invitación ya fue utilizada.',
    };
  }
  if (inv.status === 'AVAILABLE' || inv.status === 'CHECKOUT_STARTED') {
    return { ok: true, invitation: inv };
  }
  return { ok: false, code: 'unavailable', message: GENERIC_INVITATION_ERROR };
}
