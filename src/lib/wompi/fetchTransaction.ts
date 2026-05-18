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
export async function fetchWompiTransaction(transactionId: string): Promise<{
  status: string | null;
  reference?: string;
  customerEmail?: string;
  amountInCents?: number;
  customerData?: Record<string, unknown>;
  error?: string;
}> {
  const privateKey = process.env.WOMPI_PRIVATE_KEY?.trim();
  const id = transactionId?.trim();

  if (!privateKey) {
    return { status: null, error: 'WOMPI_PRIVATE_KEY not configured' };
  }
  if (!id) {
    return { status: null, error: 'missing_transaction_id' };
  }

  const url = `${wompiApiBase(privateKey)}/transactions/${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${privateKey}`,
        Accept: 'application/json',
      },
    });

    const json = (await res.json().catch(() => null)) as WompiTransactionResponse | null;

    if (!res.ok) {
      const reason = json?.error?.reason ?? `http_${res.status}`;
      console.error('[wompi/fetchTransaction] failed', { id, status: res.status, reason });
      return { status: null, error: reason };
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
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'fetch_failed';
    console.error('[wompi/fetchTransaction]', { id, error: msg });
    return { status: null, error: msg };
  }
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
