import crypto from 'node:crypto';
import {
  RENSER_CANONICAL_PRODUCT_ID,
  SKILLCERT_RENASER_PRODUCT_ID,
} from '@/src/lib/orders/renaserCheckout';
import type { CheckoutOrder } from '@/src/lib/orders/types';

export type SkillCertProvisionPayload = {
  email: string;
  firstName: string;
  lastName: string;
  productId: string;
  sourceProductId: string;
  orderReference: string;
  transactionId: string;
  amountInCents: number;
  currency: string;
};

export type SkillCertProvisionResult =
  | {
      ok: true;
      status: 'provisioned' | 'already_provisioned';
      /** True when aula created Cognito user and sent invitation email. */
      cognitoCreated?: boolean;
    }
  | { ok: false; status: number; error: string };

function getSkillCertApiBase(): string {
  const raw =
    process.env.SKILLCERT_API_URL?.trim() || 'https://skillcertacademy.somossuyos.com';
  return raw.replace(/\/$/, '');
}

function buildProvisionPayload(order: CheckoutOrder, transactionId: string): SkillCertProvisionPayload {
  return {
    email: order.email,
    firstName: order.firstName,
    lastName: order.lastName,
    productId: SKILLCERT_RENASER_PRODUCT_ID,
    sourceProductId: RENSER_CANONICAL_PRODUCT_ID,
    orderReference: order.reference,
    transactionId,
    amountInCents: order.amountInCents,
    currency: order.currency || 'COP',
  };
}

export function signSkillCertRequest(rawBody: string, timestamp: string, nonce: string, secret: string): string {
  const payload = `${timestamp}.${nonce}.${rawBody}`;
  return crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

export function buildSkillCertAuthHeaders(rawBody: string): Record<string, string> | null {
  const keyId = process.env.SKILLCERT_PROVISION_KEY_ID?.trim();
  const secret = process.env.SKILLCERT_PROVISION_SECRET?.trim();
  if (!keyId || !secret) return null;

  const timestamp = String(Math.floor(Date.now() / 1000));
  const nonce = crypto.randomUUID();
  const signature = signSkillCertRequest(rawBody, timestamp, nonce, secret);

  return {
    'Content-Type': 'application/json',
    'X-SkillCert-Key-Id': keyId,
    'X-SkillCert-Timestamp': timestamp,
    'X-SkillCert-Nonce': nonce,
    'X-SkillCert-Signature': signature,
  };
}

export async function provisionSkillCertAccess(
  order: CheckoutOrder,
  transactionId: string,
  fetchImpl: typeof fetch = fetch,
): Promise<SkillCertProvisionResult> {
  const bodyObj = buildProvisionPayload(order, transactionId);
  const rawBody = JSON.stringify(bodyObj);
  const headers = buildSkillCertAuthHeaders(rawBody);

  if (!headers) {
    return { ok: false, status: 500, error: 'skillcert_credentials_not_configured' };
  }

  const url = `${getSkillCertApiBase()}/api/internal/provision-access`;

  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers,
      body: rawBody,
    });

    const text = await res.text().catch(() => '');
    let message = text.slice(0, 200);
    try {
      const j = JSON.parse(text) as { error?: string; message?: string };
      message = j.error || j.message || message;
    } catch {
      /* plain text */
    }

    if (res.status === 200) {
      let cognitoCreated: boolean | undefined;
      try {
        const parsed = JSON.parse(text) as { cognitoCreated?: unknown; status?: unknown };
        if (parsed.cognitoCreated === true) {
          cognitoCreated = true;
        } else if (parsed.cognitoCreated === false) {
          cognitoCreated = false;
        }
      } catch {
        /* non-json legacy */
      }
      const lower = text.toLowerCase();
      if (lower.includes('already')) {
        return { ok: true, status: 'already_provisioned', cognitoCreated };
      }
      return { ok: true, status: 'provisioned', cognitoCreated };
    }

    return { ok: false, status: res.status, error: message || `http_${res.status}` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'fetch_failed';
    return { ok: false, status: 500, error: msg };
  }
}
