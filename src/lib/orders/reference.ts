import crypto from 'node:crypto';

const RENSER_REFERENCE_PREFIX = 'ss-renaser-';

/** Referencia única para checkout RenaSER (orden persistida en DynamoDB). */
export function buildRenaserOrderReference(): string {
  return `${RENSER_REFERENCE_PREFIX}${crypto.randomUUID()}`;
}

export function isRenaserOrderReference(reference: string | undefined | null): boolean {
  if (!reference?.trim()) return false;
  return reference.trim().startsWith(RENSER_REFERENCE_PREFIX);
}
