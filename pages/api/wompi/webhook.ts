import type { NextApiRequest, NextApiResponse } from 'next';
import { resolveEventChecksum, verifyWompiEventChecksum } from '@/src/lib/wompi/webhookVerify';
import { sendOrderConfirmationEmail } from '@/src/lib/email/sendOrderConfirmation';
import { str } from '@/src/lib/wompi/webhookStrings';
import {
  customerFullNameFromWompiTransaction,
  productLabelFromWompiTransaction,
} from '@/src/lib/wompi/webhookTransactionMeta';

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

function maskEmail(email: string): string {
  const parts = email.trim().split('@');
  if (parts.length !== 2 || !parts[0].length) return '(redacted)';
  const [user, domain] = parts;
  const vis = user.length <= 2 ? '*' : `${user.slice(0, 2)}…`;
  return `${vis}@${domain}`;
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

  const trx = getTrx(body) as Record<string, unknown> | undefined;
  const eventName = typeof body.event === 'string' ? body.event : 'unknown';

  console.info('[wompi/webhook] received', {
    event: eventName,
    hasTransaction: Boolean(trx),
  });

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

  const statusRaw = trx ? str(trx.status).toUpperCase() : '';
  const reference = trx ? str(trx.reference) : '';
  const trxId = trx ? str(trx.id) : '';
  const customerEmail = (() => {
    const raw = trx?.customer_email ?? trx?.customerEmail;
    return typeof raw === 'string' ? raw.trim() : '';
  })();
  const amt =
    trx && typeof trx.amount_in_cents !== 'undefined' ? Number(trx.amount_in_cents) : undefined;

  console.info('[wompi/webhook] parsed transaction', {
    event: eventName,
    status: statusRaw || null,
    reference: reference || null,
    trxId: trxId || null,
  });

  if (statusRaw === 'APPROVED') {
    console.info('[wompi/webhook] payment approved', {
      reference: reference || null,
      trxId: trxId || null,
      hasCustomerEmail: Boolean(customerEmail),
    });

    if (customerEmail) {
      const fullName = customerFullNameFromWompiTransaction(trx);
      const productName = productLabelFromWompiTransaction(trx);

      const emailResult = await sendOrderConfirmationEmail({
        email: customerEmail,
        fullName: fullName || undefined,
        reference: reference || trxId || 'unknown',
        transactionId: trxId || 'unknown',
        amountInCents: Number.isFinite(amt as number) ? (amt as number) : undefined,
        status: statusRaw,
        productSummary: reference ? `Referencia de orden: ${reference}` : undefined,
        fulfillmentTemplate: 'digital_download',
        ...(productName ? { productName } : {}),
      });

      if (emailResult.sent) {
        console.info('[wompi/webhook] digital fulfillment email sent', {
          reference: reference || null,
          to: maskEmail(customerEmail),
        });
      } else {
        console.error('[wompi/webhook] resend error', {
          reference: reference || null,
          to: maskEmail(customerEmail),
          error: emailResult.error ?? 'unknown',
        });
      }
    } else {
      console.warn('[wompi/webhook] APPROVED sin customer_email — no se envía correo.');
    }

    /** Punto futuro: persistir en CMS (tipo transacciones) con STRAPI API token — no hay contrato garantizado aquí */
  } else if (trx) {
    console.info('[wompi/webhook] no email action (not approved)', {
      event: eventName,
      status: statusRaw || null,
    });
  }

  return res.status(200).json({ received: true });
}
