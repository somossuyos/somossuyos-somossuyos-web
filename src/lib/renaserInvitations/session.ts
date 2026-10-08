import crypto from 'node:crypto';
import {
  getInvitationSessionCookieName,
  getInvitationSessionSecret,
  getInvitationSessionTtlSeconds,
} from './config';

export type InvitationSessionPayload = {
  th: string;
  exp: number;
};

function signPayload(encoded: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(encoded, 'utf8').digest('base64url');
}

export function createInvitationSessionValue(tokenHash: string): string | null {
  const secret = getInvitationSessionSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + getInvitationSessionTtlSeconds();
  const payload: InvitationSessionPayload = { th: tokenHash, exp };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = signPayload(encoded, secret);
  return `${encoded}.${sig}`;
}

export function parseInvitationSessionValue(raw: string | undefined | null): InvitationSessionPayload | null {
  const secret = getInvitationSessionSecret();
  if (!secret || !raw?.trim()) return null;
  const parts = raw.trim().split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  const expected = signPayload(encoded, secret);
  try {
    const a = Buffer.from(sig, 'base64url');
    const b = Buffer.from(expected, 'base64url');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const json = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as InvitationSessionPayload;
    if (!json.th || typeof json.exp !== 'number') return null;
    if (json.exp < Math.floor(Date.now() / 1000)) return null;
    return json;
  } catch {
    return null;
  }
}

export function invitationSessionCookieHeader(value: string): string {
  const maxAge = getInvitationSessionTtlSeconds();
  const name = getInvitationSessionCookieName();
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearInvitationSessionCookieHeader(): string {
  const name = getInvitationSessionCookieName();
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function readInvitationSessionFromRequest(
  cookieHeader: string | undefined,
): InvitationSessionPayload | null {
  const name = getInvitationSessionCookieName();
  if (!cookieHeader) return null;
  const match = cookieHeader.split(';').map((p) => p.trim()).find((p) => p.startsWith(`${name}=`));
  if (!match) return null;
  const value = match.slice(name.length + 1);
  return parseInvitationSessionValue(decodeURIComponent(value));
}
