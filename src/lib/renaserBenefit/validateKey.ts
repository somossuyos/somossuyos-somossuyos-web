import crypto from 'node:crypto';
import { getSharedBenefitToken } from './config';

export function validateSharedBenefitKey(provided: string | undefined | null): boolean {
  const expected = getSharedBenefitToken();
  if (!expected || !provided?.trim()) return false;
  const a = Buffer.from(provided.trim(), 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
