import crypto from 'node:crypto';

/**
 * Valida el checksum de eventos Wompi (transaction.updated).
 * Ver: docs.wompi.co — eventos — signature.properties / checksum / X-Event-Checksum header.
 *
 * Probamos concatenación sin secreto primero (formato habitual en algunos payloads);
 * si WOMPI_INTEGRITY_SECRET está definido, probamos también con appends comunes como respaldo.
 */
export function resolveEventChecksum(headers: IncomingHttpHeadersLite, body: Record<string, unknown>): string | undefined {
  const fromHeader =
    normalizeHeader(headers, 'x-event-checksum') || normalizeHeader(headers, 'x-wompi-signature');
  const sig = body.signature as { checksum?: string } | undefined;
  const fromBody = typeof sig?.checksum === 'string' ? sig.checksum : undefined;
  return fromHeader || fromBody || undefined;
}

type IncomingHttpHeadersLite = Record<string, string | string[] | undefined> | undefined;

function normalizeHeader(headers: IncomingHttpHeadersLite, name: string): string | undefined {
  if (!headers) return undefined;
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());
  if (!key) return undefined;
  const val = headers[key];
  const s = Array.isArray(val) ? val[0] : val;
  return typeof s === 'string' && s.trim() ? s.trim() : undefined;
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return '';
    cur = (cur as Record<string, unknown>)[p];
  }
  if (cur === null || cur === undefined) return '';
  if (typeof cur === 'object') return '';
  return String(cur);
}

function hashHexSha256(payload: string): string {
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
}

function timingSafeHexEqual(a: string, b: string): boolean {
  const aa = Buffer.from(String(a).toLowerCase(), 'hex');
  const bb = Buffer.from(String(b).toLowerCase(), 'hex');
  if (aa.length !== bb.length || aa.length === 0) return false;
  try {
    return crypto.timingSafeEqual(aa, bb);
  } catch {
    return false;
  }
}

export function verifyWompiEventChecksum(
  body: {
    signature?: { properties?: string[]; checksum?: string };
    data?: Record<string, unknown>;
  },
  checksumFromTransport: string | undefined
): { ok: boolean; reason?: string } {
  const checksum = checksumFromTransport || body.signature?.checksum;
  const props = body.signature?.properties;
  const data = body.data;
  const integritySecret =
    typeof process.env.WOMPI_INTEGRITY_SECRET === 'string' ? process.env.WOMPI_INTEGRITY_SECRET.trim() : '';
  const extraSecret =
    typeof process.env.WOMPI_EVENTS_SECRET === 'string' ? process.env.WOMPI_EVENTS_SECRET.trim() : '';

  if (!checksum || !props?.length || !data) {
    return { ok: false, reason: 'missing_signature_payload' };
  }

  const joined = props.map((p) => getNestedValue(data, p)).join('');

  const candidates: string[] = [joined];
  if (integritySecret) {
    candidates.push(`${joined}${integritySecret}`);
    candidates.push(joined + integritySecret);
  }
  if (extraSecret) {
    candidates.push(`${joined}${extraSecret}`);
    candidates.push(joined + extraSecret);
  }

  for (const c of candidates) {
    const computed = hashHexSha256(c);
    if (
      timingSafeHexEqual(computed, checksum) ||
      computed.toLowerCase() === checksum.toLowerCase().replace(/^0x/, '')
    ) {
      return { ok: true };
    }
  }

  return { ok: false, reason: 'checksum_mismatch' };
}
