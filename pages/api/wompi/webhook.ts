import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getCheckoutOrderByReference,
  markProvisioningCompleted,
  markProvisioningFailed,
  tryMarkProvisioningProcessing,
  updateCheckoutOrderStatus,
} from '@/src/lib/orders/checkoutOrdersRepository';
import { processWompiTransactionUpdate } from '@/src/lib/wompi/processWompiTransaction';
import { evaluateWompiWebhookAuth } from '@/src/lib/wompi/webhookAuthPolicy';
import { str } from '@/src/lib/wompi/webhookStrings';

type WompiLikeBody = {
  event?: string;
  timestamp?: number | string;
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body: WompiLikeBody;
  try {
    body =
      typeof req.body === 'object' && req.body
        ? (req.body as WompiLikeBody)
        : JSON.parse(req.body as string);
  } catch {
    console.error('[wompi/webhook] invalid JSON');
    return res.status(400).json({ error: 'invalid_json' });
  }

  const auth = evaluateWompiWebhookAuth(req.headers, body as WompiLikeBody & Record<string, unknown>);
  if (!auth.ok) {
    console.warn('[wompi/webhook] auth rejected', { error: auth.error, detail: auth.detail });
    return res.status(auth.httpStatus).json({ error: auth.error, detail: auth.detail });
  }
  if (auth.skipped) {
    console.warn('[wompi/webhook] VERIFY DISABLED — solo desarrollo seguro.');
  } else {
    console.info('[wompi/webhook] signature ok', { channel: auth.channel });
  }

  const trx = getTrx(body);
  const eventName = typeof body.event === 'string' ? body.event : 'unknown';

  console.info('[wompi/webhook] received', {
    event: eventName,
    hasTransaction: Boolean(trx),
    status: trx ? str(trx.status) : null,
  });

  const deps = {
    getCheckoutOrderByReference,
    updateCheckoutOrderStatus,
    tryMarkProvisioningProcessing,
    markProvisioningCompleted,
    markProvisioningFailed,
  };

  await processWompiTransactionUpdate(trx, deps);

  return res.status(200).json({ received: true });
}
