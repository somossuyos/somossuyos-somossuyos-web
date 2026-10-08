/** Mirror server `RENASER_INVITATIONS_ENFORCE` for UI (build-time). */
export function isRenaserInvitationsPublicEnforced(): boolean {
  return process.env.NEXT_PUBLIC_RENASER_INVITATIONS_ENFORCE !== 'false';
}
