import type { NextApiRequest, NextApiResponse } from 'next';
import { resolveEventChecksum, verifyWompiEventChecksum } from '@/src/lib/wompi/webhookVerify';
import { sendOrderConfirmationEmail } from '@/src/lib/email/sendOrderConfirmation';

type WompiLikeBody = {
  event?: string;
  data?: {
    transaction?: Record<string, unknown>;
    [key: string]: unknown;
  };
  signature?: {
    properties?: string[];
    checksum?: string;
  };
};

function getTrx(body: WompiLikeBody): Record<string, unknown> | undefined {
  if (body.data?.transaction && typeof body.data.transaction === 'object') {
    return body.data.transaction;
  }
  return undefined;
}

function str(v: unknown): string {
  return v === null || v === undefined ? '' : String(v);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body: WompiLikeBody;
  try {
    body = typeof req.body === 'object' && req.body ? (req.body as WompiLikeBody) : JSON.parse(req.body as string);
  } catch {
    console.error('[wompi/webhook] invalid JSON');
    return res.status(400).json({ error: 'invalid_json' });
  }

  const skipVerify = process.env.WOMPI_WEBHOOK_DISABLE_VERIFY === 'true';

  const checksumResolved = resolveEventChecksum(req.headers, body as Record<string, unknown>);
  if (!skipVerify) {
    const v = verifyWompiEventChecksum(
      body as { signature?: { properties?: string[]; checksum?: string }; data?: Record<string, unknown> },
      checksumResolved,
    );
    if (!v.ok) {
      console.warn('[wompi/webhook] signature verify failed:', v.reason);
      /** En producción, mantener rechazo cuando el payload trae firma clara pero no valida */
      const hasStructuredSig = !!(body.signature?.properties?.length && body.signature.checksum);
      if (hasStructuredSig || checksumResolved) {
        return res.status(401).json({ error: 'invalid_signature', detail: v.reason });
      }
      console.warn('[wompi/webhook] permissive proceed: no firma usable en payload (configura secreto)');
    }
  } else {
    console.warn('[wompi/webhook] VERIFY DISABLED — solo desarrollo seguro.');
  }

  const trx = getTrx(body) as Record<string, unknown> | undefined;
  const eventName = typeof body.event === 'string' ? body.event : 'unknown';

  const statusRaw = trx ? str(trx.status).toUpperCase() : '';
  const reference = trx ? str(trx.reference) : '';
  const trxId = trx ? str(trx.id) : '';
  const customerEmail = (() => {
    const raw = trx?.customer_email ?? trx?.customerEmail;
    return typeof raw === 'string' ? raw.trim() : '';
  })();
  const amt =
    trx && typeof trx.amount_in_cents !== 'undefined' ? Number(trx.amount_in_cents) : undefined;

  console.info('[wompi/webhook]', {
    event: eventName,
    status: statusRaw || null,
    reference: reference || null,
    trxId: trxId || null,
  });

  if (statusRaw === 'APPROVED') {
    if (customerEmail) {
      const emailResult = await sendOrderConfirmationEmail({
        email: customerEmail,
        fullName: (() => {
          const cd = trx?.customer_data;
          const cdCamel = trx?.customerData;
          const o =
            cd && typeof cd === 'object'
              ? (cd as Record<string, unknown>)
              : cdCamel && typeof cdCamel === 'object'
                ? (cdCamel as Record<string, unknown>)
                : undefined;
          if (!o) return '';
          return str(o.full_name || o.fullName);
        })(),
        reference: reference || trxId || 'unknown',
        transactionId: trxId || 'unknown',
        amountInCents: Number.isFinite(amt as number) ? (amt as number) : undefined,
        status: statusRaw,
        productSummary: reference ? `Referencia de orden: ${reference}` : undefined,
      });
      console.info('[wompi/webhook] resend:', emailResult);
    } else {
      console.warn('[wompi/webhook] APPROVED sin customer_email — no correo.');
    }

    /** Punto futuro: persistir en CMS (tipo transacciones) con STRAPI API token — no hay contrato garantizado aquí */
  }

  return res.status(200).json({ received: true });
}
