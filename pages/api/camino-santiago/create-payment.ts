import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'node:crypto';
import { encodeWidgetIntegritySha256 } from '@/src/lib/wompi/integrity';
import { resolveWompiCredentialsForCheckout } from '@/src/lib/wompi/wompiCredentials';
import { getCaminoPlanById } from '@/src/lib/caminoDeSantiago/paymentPlans';
import { getLiveEurToCopRate } from '@/src/lib/caminoDeSantiago/eurCopExchange';
import {
  type CaminoPaymentChannel,
  resolveCaminoChargeWithRate,
} from '@/src/lib/caminoDeSantiago/caminoWompiPricing';

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
  displayEur: number;
  copPesos: number;
  surchargeCop: number;
  planId: string;
  paymentChannel: CaminoPaymentChannel;
  eurToCopRate: number;
  rateFetchedAt: string;
  rateSource: string;
};

type Err = { ok: false; error: string; code?: string };

function baseUrl(req: NextApiRequest): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');
  const host = req.headers.host;
  if (host) return `https://${host}`;
  return '';
}

function buildCaminoReference(planId: string): string {
  const rnd = crypto.randomBytes(6).toString('hex');
  return `ss-camino-${planId}-${Date.now().toString(36)}-${rnd}`;
}

function parseChannel(raw: unknown): CaminoPaymentChannel | null {
  if (raw === 'credit_card' || raw === 'other') return raw;
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Ok | Err>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = req.body as Record<string, unknown> | null;
  const planId = typeof body?.planId === 'string' ? body.planId.trim() : '';
  const paymentChannel = parseChannel(body?.paymentChannel);
  const names = typeof body?.names === 'string' ? body.names.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const phone = typeof body?.phone === 'string' ? body.phone.replace(/\s/g, '') : '';

  if (!planId || !paymentChannel || !names || !email || !phone) {
    return res.status(400).json({ ok: false, error: 'Datos incompletos.', code: 'invalid_payload' });
  }

  const plan = getCaminoPlanById(planId);
  if (!plan) {
    return res.status(400).json({ ok: false, error: 'Plan de pago no válido.', code: 'invalid_plan' });
  }

  const rateSnap = await getLiveEurToCopRate();
  if (!rateSnap) {
    console.error('[camino/create-payment] sin CAMINO_EUR_TO_COP_RATE');
    return res.status(503).json({
      ok: false,
      error: 'Pagos Camino temporalmente no disponibles. Contacta a Somos Suyos.',
      code: 'rate_missing',
    });
  }

  const wompiCreds = resolveWompiCredentialsForCheckout(false);
  const publicKey = wompiCreds.publicKey;
  const integritySecret = wompiCreds.integritySecret;

  if (!publicKey || !integritySecret) {
    return res.status(500).json({
      ok: false,
      error: 'Configuración Wompi incompleta en el servidor.',
      code: 'wompi_not_configured',
    });
  }

  const reference = buildCaminoReference(plan.id);
  const { amountInCents, copPesos, surchargeCop } = resolveCaminoChargeWithRate(
    plan.amountEur,
    paymentChannel,
    rateSnap.rate,
  );

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

  const checkoutUrl = `https://checkout.wompi.co/p/?${qp.toString()}`;

  console.info('[camino/create-payment]', {
    reference,
    planId: plan.id,
    paymentChannel,
    amountInCents,
    copPesos,
    surchargeCop,
    email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
  });

  return res.status(200).json({
    ok: true,
    transactionReference: reference,
    ammount: amountInCents,
    encodedIntegritySignature,
    publicKey,
    checkoutUrl,
    redirectUrl,
    amountInCents,
    currency: 'COP',
    displayEur: plan.amountEur,
    copPesos,
    surchargeCop,
    planId: plan.id,
    paymentChannel,
    eurToCopRate: rateSnap.rate,
    rateFetchedAt: rateSnap.fetchedAt,
    rateSource: rateSnap.source,
  });
}