import { isRenaserOrderReference } from '@/src/lib/orders/reference';
import { resolveWompiEventsSecretForWebhook } from './wompiCredentials';
import { resolveEventChecksum, verifyWompiEventChecksum } from './webhookVerify';
import { str } from './webhookStrings';

type WompiBody = {
  signature?: { properties?: string[]; checksum?: string };
  data?: Record<string, unknown>;
  timestamp?: number | string;
} & Record<string, unknown>;

export type WebhookAuthResult =
  | { ok: true; skipped: boolean; channel: 'default' | 'renaser' }
  | { ok: false; httpStatus: 400 | 401; error: string; detail?: string };

function transactionReferenceFromBody(body: WompiBody): string {
  const data = body.data;
  if (!data || typeof data !== 'object') return '';
  const trx = (data as { transaction?: Record<string, unknown> }).transaction;
  if (!trx || typeof trx !== 'object') return '';
  return str(trx.reference);
}

/**
 * FAIL-CLOSED. RenaSER (`ss-renaser-*`) valida con RENASER_WOMPI_EVENTS_SECRET;
 * resto de productos con WOMPI_EVENTS_SECRET.
 * Solo `WOMPI_WEBHOOK_DISABLE_VERIFY=true` omite verificación (desarrollo).
 */
export function evaluateWompiWebhookAuth(
  headers: Record<string, string | string[] | undefined> | undefined,
  body: WompiBody,
): WebhookAuthResult {
  if (process.env.WOMPI_WEBHOOK_DISABLE_VERIFY === 'true') {
    const ref = transactionReferenceFromBody(body);
    const channel = isRenaserOrderReference(ref) ? 'renaser' : 'default';
    return { ok: true, skipped: true, channel };
  }

  const reference = transactionReferenceFromBody(body);
  const { channel, eventsSecret } = resolveWompiEventsSecretForWebhook(reference);

  if (!eventsSecret) {
    const missingVar =
      channel === 'renaser' ? 'RENASER_WOMPI_EVENTS_SECRET' : 'WOMPI_EVENTS_SECRET';
    return {
      ok: false,
      httpStatus: 401,
      error: 'webhook_verify_not_configured',
      detail: `${missingVar} missing`,
    };
  }

  const checksumResolved = resolveEventChecksum(headers, body);
  const v = verifyWompiEventChecksum(body, checksumResolved, eventsSecret);

  if (!v.ok) {
    return {
      ok: false,
      httpStatus: 401,
      error: 'invalid_signature',
      detail: v.reason,
    };
  }

  return { ok: true, skipped: false, channel };
}
