import type { NextApiRequest, NextApiResponse } from 'next';
import {
  sendOrderConfirmationEmail,
  type OrderConfirmationPayload,
} from '@/src/lib/email/sendOrderConfirmation';

/**
 * Prueba/manual: envío de confirmación (Resend).
 * Protección: header Authorization: Bearer <INTERNAL_MAIL_SECRET> o x-mail-secret.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secretExpected = process.env.INTERNAL_MAIL_SECRET?.trim();

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  const token =
    auth.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : '';

  const rawHeaderSecret = req.headers['x-mail-secret'];
  const bodySecret =
    typeof rawHeaderSecret === 'string'
      ? rawHeaderSecret
      : Array.isArray(rawHeaderSecret)
        ? rawHeaderSecret[0] ?? ''
        : '';

  if (
    secretExpected &&
    token !== secretExpected &&
    bodySecret !== secretExpected
  ) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (!secretExpected) {
    console.warn('[send-confirmation-email] INTERNAL_MAIL_SECRET sin definir.');
    return res.status(503).json({ error: 'INTERNAL_MAIL_SECRET not configured' });
  }

  try {
    const body =
      typeof req.body === 'object' && req.body
        ? (req.body as Partial<OrderConfirmationPayload>)
        : {};

    const payload: OrderConfirmationPayload = {
      email: String(body.email || '').trim(),
      fullName: body.fullName,
      reference: String(body.reference || 'test-ref'),
      transactionId: String(body.transactionId || 'test-trx'),
      amountInCents: body.amountInCents,
      status: body.status ? String(body.status) : 'APPROVED',
      productSummary: body.productSummary,
      productName: body.productName,
      pdfDownloadUrl: body.pdfDownloadUrl,
      subjectOverride: body.subjectOverride,
      fulfillmentTemplate: body.fulfillmentTemplate,
    };

    if (!payload.email.includes('@')) {
      return res.status(400).json({ error: 'invalid email' });
    }

    const r = await sendOrderConfirmationEmail(payload);
    return res.status(r.sent ? 200 : 500).json(r);
  } catch {
    return res.status(500).json({ sent: false, error: 'send failed' });
  }
}
