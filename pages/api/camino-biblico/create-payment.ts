import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'node:crypto';
import { encodeWidgetIntegritySha256 } from '@/src/lib/wompi/integrity';
import { resolveWompiCredentialsForCheckout } from '@/src/lib/wompi/wompiCredentials';
import {
  CAMINO_BIBLICO_AMOUNT_IN_CENTS,
  CAMINO_BIBLICO_PRICE_COP,
  CAMINO_BIBLICO_REFERENCE_PREFIX,
} from '@/src/lib/caminoBiblico/product';

type Ok = {
  ok: true;
  transactionReference: string;
  ammount: number;
  encodedIntegritySignature: string;
  publicKey: string;
  checkoutUrl: string;
  redirectUrl: string | null;
  amountInCents: number;
  currency: 'COP';
};

type Err = { ok: false; error: string };

function baseUrl(req: NextApiRequest): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');
  const host = req.headers.host;
  if (host) return `https://${host}`;
  return '';
}

function buildReference(): string {
  const rnd = crypto.randomBytes(6).toString('hex');
  return `${CAMINO_BIBLICO_REFERENCE_PREFIX}${Date.now().toString(36)}-${rnd}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Ok | Err>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = req.body as Record<string, unknown> | null;
  const names = typeof body?.names === 'string' ? body.names.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const phone = typeof body?.phone === 'string' ? body.phone.replace(/\s/g, '') : '';

  if (!names || !email || !phone || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'Datos incompletos.' });
  }

  const wompiCreds = resolveWompiCredentialsForCheckout(false);
  const publicKey = wompiCreds.publicKey;
  const integritySecret = wompiCreds.integritySecret;

  if (!publicKey || !integritySecret) {
    return res.status(500).json({ ok: false, error: 'Pagos temporalmente no disponibles.' });
  }

  const reference = buildReference();
  const amountInCents = CAMINO_BIBLICO_AMOUNT_IN_CENTS;
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
  if (redirectUrl) qp.set('redirect-url', redirectUrl);

  console.info('[camino-biblico/create-payment]', {
    reference,
    amountInCents,
    priceCop: CAMINO_BIBLICO_PRICE_COP,
    email: email.replace(/^(.{2}).*(@.*)$/, '$1***$2'),
  });

  return res.status(200).json({
    ok: true,
    transactionReference: reference,
    ammount: amountInCents,
    encodedIntegritySignature,
    publicKey,
    checkoutUrl: `https://checkout.wompi.co/p/?${qp.toString()}`,
    redirectUrl,
    amountInCents,
    currency: 'COP',
  });
}