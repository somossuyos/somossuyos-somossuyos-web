const EMAIL_SYNTAX =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

export function normalizeInvitationEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidInvitationEmailSyntax(emailNormalized: string): boolean {
  if (!emailNormalized || emailNormalized.length > 254) return false;
  return EMAIL_SYNTAX.test(emailNormalized);
}

/** e.g. pe***@example.com */
export function maskEmailForDisplay(emailNormalized: string): string {
  const at = emailNormalized.indexOf('@');
  if (at <= 0) return '***';
  const local = emailNormalized.slice(0, at);
  const domain = emailNormalized.slice(at + 1);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}
