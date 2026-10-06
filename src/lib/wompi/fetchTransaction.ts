import { getWompiPrivateKeysForTransactionLookup } from './wompiCredentials';

/** Respuesta típica GET /v1/transactions/{id} */
type WompiTransactionData = {
  id?: string;
  status?: string;
  reference?: string;
  customer_email?: string;
  amount_in_cents?: number;
  customer_data?: Record<string, unknown>;
  customerData?: Record<string, unknown>;
};

type WompiTransactionResponse = {
  data?: WompiTransactionData;
  error?: { reason?: string; type?: string };
};

function wompiApiBase(privateKey: string): string {
  return /^prv_test_/i.test(privateKey)
    ? 'https://sandbox.wompi.co/v1'
    : 'https://production.wompi.co/v1';
}

/**
 * Consulta el estado real de una transacción en Wompi (fuente de verdad post-pago).
 * Requiere WOMPI_PRIVATE_KEY en el servidor.
 */
async function fetchWompiTransactionWithPrivateKey(
  transactionId: string,
  privateKey: string,
): Promise<{
  status: string | null;
  reference?: string;
  customerEmail?: string;
  amountInCents?: number;
  customerData?: Record<string, unknown>;
  error?: string;
  httpStatus?: number;
}> {
  const id = transactionId.trim();
  const url = `${wompiApiBase(privateKey)}/transactions/${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${privateKey}`,
      Accept: 'application/json',
    },
  });

  const json = (await res.json().catch(() => null)) as WompiTransactionResponse | null;

  if (!res.ok) {
    const reason = json?.error?.reason ?? `http_${res.status}`;
    return { status: null, error: reason, httpStatus: res.status };
  }

  const d = json?.data;
  const status = typeof d?.status === 'string' ? d.status.trim().toUpperCase() : null;
  const reference = typeof d?.reference === 'string' ? d.reference : undefined;
  const customerEmail =
    typeof d?.customer_email === 'string' ? d.customer_email.trim() : undefined;
  const amountInCents =
    typeof d?.amount_in_cents === 'number' && Number.isFinite(d.amount_in_cents)
      ? d.amount_in_cents
      : undefined;
  const customerData =
    (d?.customer_data && typeof d.customer_data === 'object' ? d.customer_data : undefined) ||
    (d?.customerData && typeof d.customerData === 'object' ? d.customerData : undefined);

  return { status, reference, customerEmail, amountInCents, customerData };
}

export async function fetchWompiTransaction(transactionId: string): Promise<{
  status: string | null;
  reference?: string;
  customerEmail?: string;
  amountInCents?: number;
  customerData?: Record<string, unknown>;
  error?: string;
}> {
  const id = transactionId?.trim();
  if (!id) {
    return { status: null, error: 'missing_transaction_id' };
  }

  const privateKeys = getWompiPrivateKeysForTransactionLookup();
  if (!privateKeys.length) {
    return { status: null, error: 'WOMPI_PRIVATE_KEY not configured' };
  }

  let lastError = 'fetch_failed';

  for (const privateKey of privateKeys) {
    try {
      const result = await fetchWompiTransactionWithPrivateKey(id, privateKey);
      if (result.status) {
        return result;
      }
      lastError = result.error ?? lastError;
      if (result.httpStatus && result.httpStatus !== 404) {
        console.error('[wompi/fetchTransaction] failed', { id, status: result.httpStatus, reason: lastError });
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message : 'fetch_failed';
      console.error('[wompi/fetchTransaction]', { id, error: lastError });
    }
  }

  return { status: null, error: lastError };
}

/** @deprecated Usa fetchWompiTransaction */
export async function fetchWompiTransactionStatus(transactionId: string) {
  const r = await fetchWompiTransaction(transactionId);
  return { status: r.status, reference: r.reference, error: r.error };
}

/** Normaliza estados Wompi al set que usa la UI de confirmación. */
export function normalizeWompiStatusForUi(status: string | null | undefined): string | null {
  if (!status) return null;
  const s = status.trim().toUpperCase();
  if (s === 'CANCELLED' || s === 'CANCELED') return 'CANCEL';
  return s;
}
