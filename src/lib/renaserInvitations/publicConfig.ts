/** Invitaciones / precio especial habilitados (compra pública sigue disponible). */
export function isRenaserInvitationFeaturePublicEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RENASER_INVITATIONS_ENFORCE !== 'false';
}

/** @deprecated Use isRenaserInvitationFeaturePublicEnabled */
export function isRenaserInvitationsPublicEnforced(): boolean {
  return isRenaserInvitationFeaturePublicEnabled();
}
