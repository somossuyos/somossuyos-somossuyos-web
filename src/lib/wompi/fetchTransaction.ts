/** Respuesta típica GET /v1/transactions/{id} */
type WompiTransactionResponse = {
  data?: {
    id?: string;
    status?: string;
    reference?: string;
    customer_email?: string;
  };
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
export async function fetchWompiTransactionStatus(transactionId: string): Promise<{
  status: string | null;
  reference?: string;
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

    const status =
      typeof json?.data?.status === 'string' ? json.data.status.trim().toUpperCase() : null;
    const reference =
      typeof json?.data?.reference === 'string' ? json.data.reference : undefined;

    return { status, reference };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'fetch_failed';
    console.error('[wompi/fetchTransaction]', { id, error: msg });
    return { status: null, error: msg };
  }
}

/** Normaliza estados Wompi al set que usa la UI de confirmación. */
export function normalizeWompiStatusForUi(status: string | null | undefined): string | null {
  if (!status) return null;
  const s = status.trim().toUpperCase();
  if (s === 'CANCELLED' || s === 'CANCELED') return 'CANCEL';
  return s;
}
