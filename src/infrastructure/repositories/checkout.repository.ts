import { CheckoutDTO } from '../DTOs/Checkout/CheckoutDTO';

export const checkoutRepository = {
  async checkout(data: CheckoutDTO) {
    const response = await fetch('/api/wompi/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      if (json && typeof (json as { error?: unknown }).error === 'string') {
        return (json as { error: string }).error;
      }
      return typeof response.statusText === 'string' ? response.statusText : 'Checkout error';
    }

    if (!json || typeof (json as { transactionReference?: unknown }).transactionReference !== 'string') {
      return 'Invalid order response';
    }

    /** Campos esperados por el widget legacy (nombre `ammount` heredado). */
    return {
      transactionReference: (json as { transactionReference: string }).transactionReference,
      ammount: (json as { ammount: number }).ammount,
      encodedIntegritySignature: (json as { encodedIntegritySignature: string }).encodedIntegritySignature,
    };
  },
  async getCheckout(id: string) {
    const response = await fetch(`${process.env.API_URL}/transacciones?fields=Estado&filters[idTransaccion][$eq]=${id}`);
    const json = await response.json();
    return json;
  },
}; 