import { Resend } from 'resend';

export type OrderConfirmationPayload = {
  email: string;
  fullName?: string;
  reference: string;
  transactionId: string;
  amountInCents?: number;
  status: string;
  productSummary?: string;
};

/** Envía confirmación usando Resend. Falla sin lanzar si no hay API key. */
export async function sendOrderConfirmationEmail(data: OrderConfirmationPayload): Promise<{
  sent: boolean;
  error?: string;
}> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || 'Somos Suyos <onboarding@resend.dev>';

  if (!key) {
    return { sent: false, error: 'RESEND_API_KEY not configured' };
  }

  const amountLine =
    data.amountInCents != null ? `Monto (centavos): ${data.amountInCents}` : '';

  try {
    const resend = new Resend(key);
    const html = `
      <h1>¡Gracias por tu compra!</h1>
      <p>Hola ${data.fullName || 'cliente'},</p>
      <p>Tu pago fue <strong>${data.status}</strong>.</p>
      <ul>
        <li><strong>Referencia:</strong> ${data.reference}</li>
        <li><strong>ID transacción Wompi:</strong> ${data.transactionId}</li>
        ${amountLine ? `<li><strong>${amountLine}</strong></li>` : ''}
      </ul>
      ${data.productSummary ? `<p>${data.productSummary}</p>` : ''}
      <p>— Somos Suyos</p>
    `.trim();

    const { error } = await resend.emails.send({
      from,
      to: data.email,
      subject: `Confirmación de pago — ${data.reference}`,
      html,
    });

    if (error) {
      return { sent: false, error: error.message };
    }
    return { sent: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    return { sent: false, error: msg };
  }
}
