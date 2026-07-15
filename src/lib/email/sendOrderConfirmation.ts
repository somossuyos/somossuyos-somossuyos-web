import { Resend } from 'resend';

/** PDF por defecto (novena digital); puede sobreescribirse con WOMPI_DIGITAL_PDF_URL. */
export const DEFAULT_DIGITAL_PDF_URL =
  'https://somossuyos-downloads.s3.us-east-1.amazonaws.com/Novena+E.S.+Digital+V2.pdf';

export type OrderConfirmationPayload = {
  email: string;
  fullName?: string;
  reference: string;
  transactionId: string;
  amountInCents?: number;
  status: string;
  productSummary?: string;
  /** Nombre del producto (ej. en correo post-compra). */
  productName?: string;
  /** Enlace de descarga (PDF en S3, etc.). */
  pdfDownloadUrl?: string;
  /** Si se indica, sustituye el asunto por defecto. */
  subjectOverride?: string;
  /** URL de acceso digital (grabación RenaSER, etc.). */
  accessUrl?: string;
  /**
   * `digital_download`: agradecimiento, producto y enlace al PDF (post-pago Wompi).
   * `renaser_recording`: correo específico grabación RenaSER 2026.
   * Omitir o `default`: confirmación genérica.
   */
  fulfillmentTemplate?: 'default' | 'digital_download' | 'renaser_recording';
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildDigitalDownloadHtml(props: {
  greetingName: string;
  productName: string;
  pdfUrl: string;
  reference: string;
}): string {
  const { greetingName, productName, pdfUrl, reference } = props;
  const safeProduct = escapeHtml(productName);
  const safeName = escapeHtml(greetingName);
  const safeRef = escapeHtml(reference);
  const safeUrl = escapeHtml(pdfUrl);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Novena de Sanación</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding:28px 32px 8px 32px;text-align:center;border-bottom:1px solid #ececee;">
              <p style="margin:0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                Somos Suyos
              </p>
              <h1 style="margin:12px 0 20px 0;font-size:24px;font-weight:600;color:#1f2937;line-height:1.35;">
                Gracias por tu compra 💛
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 8px 32px;font-size:16px;line-height:1.65;color:#374151;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <p style="margin:0 0 16px 0;">Hola${safeName ? ` <strong>${safeName}</strong>` : ''},</p>
              <p style="margin:0 0 16px 0;">
                Tu pago fue exitoso. Aquí tienes tu <strong>${safeProduct}</strong> en formato digital.
              </p>
              <p style="margin:0 0 20px 0;color:#6b7280;font-size:14px;">
                Referencia de orden: <span style="color:#111827;">${safeRef}</span>
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 24px auto;">
                <tr>
                  <td style="border-radius:999px;background:#111827;">
                    <a href="${safeUrl}" target="_blank" rel="noopener noreferrer"
                      style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                      Descargar la novena (PDF)
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px 0;font-size:14px;color:#6b7280;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
              </p>
              <p style="margin:0 0 24px 0;word-break:break-all;font-size:13px;color:#3b82f6;">
                <a href="${safeUrl}" style="color:#2563eb;">${safeUrl}</a>
              </p>
              <p style="margin:0;font-size:16px;line-height:1.65;color:#374151;">
                Bendiciones,<br>
                <strong style="color:#1f2937;">Somos Suyos</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px 32px;border-top:1px solid #ececee;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                Este mensaje se envía porque completaste un pago en nuestro sitio.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

function buildRenaserRecordingHtml(props: {
  greetingName: string;
  accessUrl: string;
}): string {
  const safeName = escapeHtml(props.greetingName);
  const safeUrl = escapeHtml(props.accessUrl);

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grabación Congreso RenaSER 2026</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding:28px 32px 8px 32px;text-align:center;border-bottom:1px solid #ececee;">
              <p style="margin:0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                Somos Suyos
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 8px 32px;font-size:16px;line-height:1.65;color:#374151;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <p style="margin:0 0 16px 0;">Hola${safeName ? ` <strong>${safeName}</strong>` : ''},</p>
              <p style="margin:0 0 16px 0;">
                ¡Gracias por comprar la grabación del Congreso RenaSER 2026! Estamos muy
                emocionados de compartirla contigo.
              </p>
              <p style="margin:0 0 16px 0;">
                Ahora mismo estamos preparando el video en nuestra plataforma. Estará listo para
                descargar a finales de julio de 2026.
              </p>
              <p style="margin:0 0 20px 0;">
                Guarda este enlace permanente. Cuando el video esté habilitado, podrás descargarlo
                desde ahí (no estará disponible para ver en línea, solo para descarga):
              </p>
              <p style="margin:0 0 24px 0;word-break:break-all;font-size:15px;">
                <a href="${safeUrl}" style="color:#2563eb;">${safeUrl}</a>
              </p>
              <p style="margin:0;font-size:16px;line-height:1.65;color:#374151;">
                Gracias por ser parte de esta experiencia.<br><br>
                <strong style="color:#1f2937;">Somos Suyos</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

function buildRenaserRecordingText(props: {
  greetingName: string;
  accessUrl: string;
}): string {
  const greeting = props.greetingName ? `Hola ${props.greetingName},` : 'Hola,';
  return [
    greeting,
    '',
    '¡Gracias por comprar la grabación del Congreso RenaSER 2026! Estamos muy emocionados de compartirla contigo.',
    '',
    'Ahora mismo estamos preparando el video en nuestra plataforma. Estará listo para descargar a finales de julio de 2026.',
    '',
    'Guarda este enlace permanente. Cuando el video esté habilitado, podrás descargarlo desde ahí (no estará disponible para ver en línea, solo para descarga):',
    '',
    props.accessUrl,
    '',
    'Gracias por ser parte de esta experiencia.',
    '',
    'Somos Suyos',
  ].join('\n');
}

function buildDigitalDownloadText(props: {
  greetingName: string;
  productName: string;
  pdfUrl: string;
}): string {
  const lines = [
    'Gracias por tu compra 💛',
    '',
    props.greetingName ? `Hola ${props.greetingName},` : 'Hola,',
    '',
    `Producto: ${props.productName}`,
    '',
    'Puedes descargar tu novena aquí:',
    props.pdfUrl,
    '',
    'Bendiciones,',
    'Somos Suyos',
  ];
  return lines.join('\n');
}

function buildDefaultHtml(data: OrderConfirmationPayload): string {
  const amountLine =
    data.amountInCents != null ? `Monto (centavos): ${data.amountInCents}` : '';
  return `
      <h1>¡Gracias por tu compra!</h1>
      <p>Hola ${escapeHtml(data.fullName || 'cliente')},</p>
      <p>Tu pago fue <strong>${escapeHtml(data.status)}</strong>.</p>
      <ul>
        <li><strong>Referencia:</strong> ${escapeHtml(data.reference)}</li>
        <li><strong>ID transacción Wompi:</strong> ${escapeHtml(data.transactionId)}</li>
        ${amountLine ? `<li><strong>${escapeHtml(amountLine)}</strong></li>` : ''}
      </ul>
      ${data.productSummary ? `<p>${escapeHtml(data.productSummary)}</p>` : ''}
      <p>— Somos Suyos</p>
    `.trim();
}

/** Dominio verificado en Resend para envío (subdominio updates). */
const RESEND_VERIFIED_FROM_EMAIL = 'contacto@updates.somossuyos.com';

function normalizeResendMailbox(email: string): string {
  const lower = email.toLowerCase();
  if (lower === 'contacto@somossuyos.com' || lower.endsWith('@somossuyos.com')) {
    const local = email.includes('@') ? email.split('@')[0] : 'contacto';
    return `${local}@updates.somossuyos.com`;
  }
  return email;
}

function formatResendFromAddress(): string {
  const raw = process.env.RESEND_FROM_EMAIL?.trim();
  if (!raw) return `Somos Suyos <${RESEND_VERIFIED_FROM_EMAIL}>`;
  if (raw.includes('<') && raw.includes('>')) {
    const match = raw.match(/<([^>]+)>/);
    if (match?.[1]) {
      const name = raw.slice(0, raw.indexOf('<')).trim() || 'Somos Suyos';
      return `${name} <${normalizeResendMailbox(match[1].trim())}>`;
    }
    return raw;
  }
  return `Somos Suyos <${normalizeResendMailbox(raw)}>`;
}

/** Envía confirmación usando Resend. Falla sin lanzar si no hay API key. */
export async function sendOrderConfirmationEmail(data: OrderConfirmationPayload): Promise<{
  sent: boolean;
  error?: string;
  /** ID de Resend para rastrear en resend.com/emails */
  emailId?: string;
}> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = formatResendFromAddress();

  if (!key) {
    return { sent: false, error: 'RESEND_API_KEY not configured' };
  }

  const useRenaserTemplate = data.fulfillmentTemplate === 'renaser_recording';
  const useDownloadTemplate = data.fulfillmentTemplate === 'digital_download';
  const useFulfillmentTemplate = useRenaserTemplate || useDownloadTemplate;

  const accessUrl = useRenaserTemplate
    ? (data.accessUrl && data.accessUrl.trim()) || ''
    : '';

  const pdfUrl = useDownloadTemplate
    ? (data.pdfDownloadUrl && data.pdfDownloadUrl.trim()) ||
      process.env.WOMPI_DIGITAL_PDF_URL?.trim() ||
      DEFAULT_DIGITAL_PDF_URL
    : '';

  const productName = useDownloadTemplate
    ? (data.productName && data.productName.trim()) ||
      process.env.WOMPI_DIGITAL_PRODUCT_NAME?.trim() ||
      'Novena E.S. Digital'
    : '';

  const greeting = (data.fullName && data.fullName.trim()) || '';

  const subject =
    data.subjectOverride?.trim() ||
    (useRenaserTemplate
      ? 'Gracias por comprar la grabación del Congreso RenaSER 2026'
      : useDownloadTemplate
        ? 'Tu Novena de Sanación ✨'
        : `Confirmación de pago — ${data.reference}`);

  if (useRenaserTemplate && !accessUrl) {
    return {
      sent: false,
      error: 'renaser_recording template requires accessUrl',
    };
  }

  if (useDownloadTemplate && !pdfUrl) {
    return {
      sent: false,
      error: 'digital_download template requires pdfDownloadUrl or WOMPI_DIGITAL_PDF_URL',
    };
  }

  const html = useRenaserTemplate
    ? buildRenaserRecordingHtml({ greetingName: greeting, accessUrl })
    : useDownloadTemplate
      ? buildDigitalDownloadHtml({
          greetingName: greeting,
          productName,
          pdfUrl,
          reference: data.reference,
        })
      : buildDefaultHtml(data);

  const text = useRenaserTemplate
    ? buildRenaserRecordingText({ greetingName: greeting, accessUrl })
    : useDownloadTemplate
      ? buildDigitalDownloadText({
          greetingName: greeting,
          productName,
          pdfUrl,
        })
      : undefined;

  const idempotencyKey =
    useFulfillmentTemplate && data.transactionId
      ? `fulfillment-${useRenaserTemplate ? 'renaser-' : ''}${data.transactionId}`
      : undefined;

  try {
    if (idempotencyKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          from,
          to: [data.email],
          subject,
          html,
          ...(text ? { text } : {}),
        }),
      });
      const json = (await res.json().catch(() => null)) as { id?: string; message?: string } | null;
      if (!res.ok) {
        return { sent: false, error: json?.message ?? `resend_http_${res.status}` };
      }
      return { sent: true, emailId: json?.id };
    }

    const resend = new Resend(key);
    const { data: sentData, error } = await resend.emails.send({
      from,
      to: data.email,
      subject,
      html,
      ...(text ? { text } : {}),
    });

    if (error) {
      return { sent: false, error: error.message };
    }
    return { sent: true, emailId: sentData?.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error';
    return { sent: false, error: msg };
  }
}
