export const DEFAULT_INVITATIONS_TABLE = 'RenaSERPurchaseInvitations';

export const GENERIC_INVITATION_ERROR =
  'La invitación no es válida o ya no está disponible.';

export const INVITATION_ALREADY_USED_MESSAGE =
  'Esta invitación ya fue utilizada.';

export const AULA_VIRTUAL_URL = 'https://skillcertacademy.somossuyos.com';

export function getInvitationsTableName(): string {
  return process.env.RENASER_INVITATIONS_TABLE_NAME?.trim() || DEFAULT_INVITATIONS_TABLE;
}

/** ISO8601; unset = invitations without expiry (not recommended for 2026 list). */
export function getInvitationExpiresAt(): string | undefined {
  const raw = process.env.RENASER_INVITATION_EXPIRES_AT?.trim();
  return raw || undefined;
}

export function getReservationMinutes(): number {
  const raw = process.env.RENASER_INVITATION_RESERVATION_MINUTES?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 30;
  if (!Number.isFinite(n) || n < 5) return 30;
  return Math.min(n, 120);
}

/**
 * Invitaciones y precio especial habilitados (no bloquea compra pública a precio lista).
 * `RENASER_INVITATIONS_ENFORCE=false` desactiva solo el camino invitado (legacy).
 */
export function isRenaserInvitationFeatureEnabled(): boolean {
  return process.env.RENASER_INVITATIONS_ENFORCE !== 'false';
}

/** @deprecated Use isRenaserInvitationFeatureEnabled — ya no implica invitation-only. */
export function isInvitationEnforcementEnabled(): boolean {
  return isRenaserInvitationFeatureEnabled();
}

export function getInvitationSessionSecret(): string | undefined {
  return process.env.RENASER_INVITATION_SESSION_SECRET?.trim() || undefined;
}

export function getInvitationSessionCookieName(): string {
  return 'renaser_inv';
}

export function getInvitationSessionTtlSeconds(): number {
  const raw = process.env.RENASER_INVITATION_SESSION_TTL_SECONDS?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 3600;
  return Number.isFinite(n) && n >= 300 ? Math.min(n, 86400) : 3600;
}

export function buildInvitationLandingUrl(token: string): string {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL?.trim()?.replace(/\/$/, '') ||
    'https://www.somossuyos.com';
  const qp = new URLSearchParams({ t: token });
  return `${base}/renaser/invitacion?${qp.toString()}`;
}
