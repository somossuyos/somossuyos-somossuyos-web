import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'node:crypto';
import { encodeWidgetIntegritySha256 } from '@/src/lib/wompi/integrity';
import type { CheckoutDTO } from '@/src/infrastructure/DTOs/Checkout/CheckoutDTO';
import { logWompiServerEnvDiagnostics, shouldLogWompiEnvVerbose } from '@/src/lib/wompi/serverEnv';
import { resolveWompiCredentialsForCheckout } from '@/src/lib/wompi/wompiCredentials';
import { getMemoriasCongresoSinglePurchaseCheckoutError } from '@/src/lib/shop/memoriasCongresoCourse';
import { putPendingCheckoutOrder } from '@/src/lib/orders/checkoutOrdersRepository';
import { buildRenaserOrderReference } from '@/src/lib/orders/reference';
import {
  buildRenaserPendingOrderFields,
  getRenaserAmountInCents,
  isRenaserCheckout,
  validateRenaserClientTotalPrice,
} from '@/src/lib/orders/renaserCheckout';
import { assertRenaserInvitationCheckout } from '@/src/lib/renaserInvitations/checkoutGuard';
import { normalizeInvitationEmail } from '@/src/lib/renaserInvitations/email';

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

function buildLegacyReference(prefix: string): string {
  const rnd = crypto.randomBytes(10).toString('hex').slice(0, 14);
  return `${prefix}${Date.now().toString(36)}_${rnd}`;
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

  const data = req.body as CheckoutDTO | null | undefined;
  if (
    !data ||
    typeof data.totalPrice !== 'number' ||
    !Number.isFinite(data.totalPrice) ||
    !data.form?.email?.trim()
  ) {
    return res.status(400).json({ ok: false, error: 'Invalid checkout payload' });
  }

  const memoriasCheckoutError = getMemoriasCongresoSinglePurchaseCheckoutError(data.items);
  if (memoriasCheckoutError) {
    return res.status(400).json({ ok: false, error: memoriasCheckoutError });
  }

  const renaSer = isRenaserCheckout(data.items);
  const wompiCreds = resolveWompiCredentialsForCheckout(renaSer);
  const publicKey = wompiCreds.publicKey;
  const integritySecret = wompiCreds.integritySecret;

  if (!publicKey || !integritySecret) {
    console.error('[wompi/create-order] faltan variables Wompi', {
      channel: wompiCreds.channel,
      renaSer,
    });
    logWompiServerEnvDiagnostics('wompi/create-order');
    return res.status(500).json({
      ok: false,
      error:
        renaSer
          ? 'Configure RENASER_WOMPI_PUBLIC_KEY y RENASER_WOMPI_INTEGRITY_SECRET para Memorias RenaSER.'
          : 'Configure WOMPI_PUBLIC_KEY (o NEXT_PUBLIC_WOMPI_PUBLIC_KEY) y WOMPI_INTEGRITY_SECRET para el servidor.',
    });
  }

  if (shouldLogWompiEnvVerbose()) {
    logWompiServerEnvDiagnostics('wompi/create-order');
  }
  let amountInCents: number;

  if (renaSer) {
    if (!validateRenaserClientTotalPrice(data.totalPrice)) {
      return res.status(400).json({ ok: false, error: 'Invalid RenaSER total price' });
    }
    amountInCents = getRenaserAmountInCents();
  } else {
    amountInCents = totalToAmountInCents(data.totalPrice);
  }

  if (amountInCents <= 0) {
    return res.status(400).json({ ok: false, error: 'Invalid amount' });
  }

  const prefix = /^pub_prod_/i.test(publicKey) ? 'ss-prod-' : 'ss-test-';
  const reference = renaSer ? buildRenaserOrderReference() : buildLegacyReference(prefix);

  try {
    if (renaSer) {
      const invitationGuard = await assertRenaserInvitationCheckout(
        req,
        data.form.email,
        reference,
      );
      if (!invitationGuard.ok) {
        return res.status(invitationGuard.httpStatus).json({
          ok: false,
          error: invitationGuard.error,
        });
      }

      const pending = buildRenaserPendingOrderFields({
        ...data.form,
        email: normalizeInvitationEmail(data.form.email),
        names: invitationGuard.firstName || data.form.names,
        lastNames: invitationGuard.lastName || data.form.lastNames,
      });
      await putPendingCheckoutOrder({
        reference,
        ...pending,
        ...(invitationGuard.tokenHash ? { invitationTokenHash: invitationGuard.tokenHash } : {}),
      });
    }

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
      renaSer,
      wompiChannel: wompiCreds.channel,
      summary: summarizeOrder(data),
    });

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
    const msg = e instanceof Error ? e.message : 'Failed to prepare order';
    if (renaSer && msg.includes('conditional')) {
      return res.status(409).json({ ok: false, error: 'Duplicate order reference' });
    }
    return res.status(500).json({ ok: false, error: 'Failed to prepare order' });
  }
}
