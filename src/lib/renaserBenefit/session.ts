import crypto from 'node:crypto';
import {
  getBenefitSessionCookieName,
  getBenefitSessionSecret,
  getBenefitSessionTtlSeconds,
} from './config';

export type BenefitSessionPayload = {
  v: 1;
  exp: number;
};

function signPayload(encoded: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(encoded, 'utf8').digest('base64url');
}

export function createBenefitSessionValue(): string | null {
  const secret = getBenefitSessionSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + getBenefitSessionTtlSeconds();
  const payload: BenefitSessionPayload = { v: 1, exp };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = signPayload(encoded, secret);
  return `${encoded}.${sig}`;
}

export function parseBenefitSessionValue(raw: string | undefined | null): BenefitSessionPayload | null {
  const secret = getBenefitSessionSecret();
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
    const json = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as BenefitSessionPayload;
    if (json.v !== 1 || typeof json.exp !== 'number') return null;
    if (json.exp < Math.floor(Date.now() / 1000)) return null;
    return json;
  } catch {
    return null;
  }
}

export function benefitSessionCookieHeader(value: string): string {
  const maxAge = getBenefitSessionTtlSeconds();
  const name = getBenefitSessionCookieName();
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function readBenefitSessionFromRequest(
  cookieHeader: string | undefined,
): BenefitSessionPayload | null {
  const name = getBenefitSessionCookieName();
  if (!cookieHeader) return null;
  const match = cookieHeader.split(';').map((p) => p.trim()).find((p) => p.startsWith(`${name}=`));
  if (!match) return null;
  const value = match.slice(name.length + 1);
  return parseBenefitSessionValue(decodeURIComponent(value));
}

export function isBenefitSessionActive(cookieHeader: string | undefined): boolean {
  return readBenefitSessionFromRequest(cookieHeader) != null;
}
