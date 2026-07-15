import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'node:crypto';
import { encodeWidgetIntegritySha256 } from '@/src/lib/wompi/integrity';
import type { CheckoutDTO } from '@/src/infrastructure/DTOs/Checkout/CheckoutDTO';
import {
  isRenaserRecordingOrder,
  RENASER_WOMPI_REFERENCE_MARKER,
} from '@/src/lib/wompi/renaserRecording';
import {
  getWompiIntegritySecretForServer,
  getWompiPublicKeyForServer,
  logWompiServerEnvDiagnostics,
  shouldLogWompiEnvVerbose,
} from '@/src/lib/wompi/serverEnv';

type CreateOrderOk = {
  ok: true;
  /** Compatible con CheckoutResponseDTO (typo legacy `ammount`). */
  transactionReference: string;
  ammount: number;
  encodedIntegritySignature: string;
  /** Clave pública para WidgetCheckout (el cliente no debe depender solo de env en build). */
  publicKey: string;
  checkoutUrl?: string;
  redirectUrl: string | null;
  amountInCents: number;
  currency: string;
};

type CreateOrderErr = {
  ok: false;
  error: string;
};

function baseUrl(req: NextApiRequest): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');
  const host = req.headers.host;
  if (host) return `https://${host}`;
  return '';
}

/** Checkout en COP (pesos sin decimales) → formato Wompi (centavos = pesos × 100). */
function totalToAmountInCents(totalPriceCop: number): number {
  if (!Number.isFinite(totalPriceCop) || totalPriceCop <= 0) return 0;
  return Math.round(totalPriceCop * 100);
}

function buildReference(prefix: string, productMarker?: string): string {
  const rnd = crypto.randomBytes(10).toString('hex').slice(0, 14);
  const marker = productMarker ? `${productMarker}-` : '';
  return `${prefix}${marker}${Date.now().toString(36)}_${rnd}`;
}

function summarizeOrder(data: CheckoutDTO): string {
  const nItems = data.items?.length ?? 0;
  return `Ítems: ${nItems}, total COP: ${data.totalPrice}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateOrderOk | CreateOrderErr>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const publicKey = getWompiPublicKeyForServer();
  const integritySecret = getWompiIntegritySecretForServer();

  if (!publicKey || !integritySecret) {
    console.error('[wompi/create-order] faltan variables server-side (valores enmascarados)');
    logWompiServerEnvDiagnostics('wompi/create-order');
    return res.status(500).json({
      ok: false,
      error:
        'Configure WOMPI_PUBLIC_KEY (o NEXT_PUBLIC_WOMPI_PUBLIC_KEY) y WOMPI_INTEGRITY_SECRET para el servidor. En Amplify, asegúrate de tener `amplify.yml` que escriba estas claves en `.env.production` antes del build.',
    });
  }

  if (shouldLogWompiEnvVerbose()) {
    logWompiServerEnvDiagnostics('wompi/create-order');
  }

  const data = req.body as CheckoutDTO | null | undefined;
  if (
    !data ||
    typeof data.totalPrice !== 'number' ||
    !Number.isFinite(data.totalPrice) ||
    !data.form?.email?.trim()
  ) {
    return res.status(400).json({ ok: false, error: 'Invalid checkout payload' });
  }

  const amountInCents = totalToAmountInCents(data.totalPrice);
  if (amountInCents <= 0) {
    return res.status(400).json({ ok: false, error: 'Invalid amount' });
  }

  const prefix = /^pub_prod_/i.test(publicKey) ? 'ss-prod-' : 'ss-test-';
  const renaserOrder = isRenaserRecordingOrder(data.items);
  const reference = buildReference(
    prefix,
    renaserOrder ? RENASER_WOMPI_REFERENCE_MARKER : undefined,
  );

  try {
    const encodedIntegritySignature = encodeWidgetIntegritySha256({
      reference,
      amountInCents,
      currency: 'COP',
      integritySecret,
    });

    const root = baseUrl(req);
    const redirectUrl =
      process.env.WOMPI_REDIRECT_URL?.trim()?.replace(/\/$/, '') ||
      (root ? `${root}/confirmacion-pago` : null);

    const qp = new URLSearchParams({
      'public-key': publicKey,
      currency: 'COP',
      'amount-in-cents': String(amountInCents),
      reference,
      'signature:integrity': encodedIntegritySignature,
    });
    if (redirectUrl) {
      qp.set('redirect-url', redirectUrl);
    }

    /** Web Checkout por GET (además del widget embebido). */
    const webCheckoutUrl = `https://checkout.wompi.co/p/?${qp.toString()}`;

    console.info('[wompi/create-order]', {
      reference,
      amountInCents,
      email: data.form.email.trim(),
      summary: summarizeOrder(data),
    });

    /* WOMPI_PRIVATE_KEY reservado para futuras llamadas REST a la API merchant. */

    const payload: CreateOrderOk = {
      ok: true,
      transactionReference: reference,
      ammount: amountInCents,
      encodedIntegritySignature,
      publicKey,
      checkoutUrl: webCheckoutUrl,
      redirectUrl,
      amountInCents,
      currency: 'COP',
    };

    return res.status(200).json(payload);
  } catch (e) {
    console.error('[wompi/create-order]', e);
    return res.status(500).json({ ok: false, error: 'Failed to prepare order' });
  }
}
