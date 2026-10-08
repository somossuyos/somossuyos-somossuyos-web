import crypto from 'node:crypto';

/** URL-safe token (32 bytes entropy). Never log or persist the raw value. */
export function generateInvitationToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function hashInvitationToken(token: string): string {
  const normalized = token.trim();
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}
