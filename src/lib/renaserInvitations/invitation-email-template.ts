import { buildInvitationLandingUrl } from './config';

export const PURCHASE_INVITATION_SUBJECT =
  'RenaSER 2026 – Acceso exclusivo a la memoria en video';

export function buildPurchaseInvitationEmail(params: {
  firstName: string;
  token: string;
}): { html: string; text: string } {
  const name = params.firstName.trim() || 'participante';
  const ctaUrl = buildInvitationLandingUrl(params.token);

  const text = [
    `Hola ${name},`,
    '',
    'Fuiste seleccionado/a para acceder de forma exclusiva a las memorias en video del Congreso RenaSER 2026.',
    '',
    'Este enlace es personal e intransferible. Solo puedes completar una compra con tu invitación.',
    '',
    `Acceder a RenaSER 2026: ${ctaUrl}`,
    '',
    'Si tienes dudas, escríbenos a contacto@somossuyos.com.',
    '',
    '— Equipo RenaSER 2026 / Somos Suyos',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="es">
<body style="font-family:system-ui,sans-serif;color:#1d1d1f;line-height:1.5;max-width:560px;margin:0 auto;padding:24px">
  <p>Hola ${escapeHtml(name)},</p>
  <p>Fuiste seleccionado/a para acceder de forma exclusiva a las <strong>memorias en video del Congreso RenaSER 2026</strong>.</p>
  <p>Este enlace es personal e intransferible. Solo puedes completar <strong>una compra</strong> con tu invitación.</p>
  <p style="margin:28px 0">
    <a href="${escapeAttr(ctaUrl)}" style="background:#1d1d1f;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;display:inline-block;font-weight:600">Acceder a RenaSER 2026</a>
  </p>
  <p style="font-size:14px;color:#666">Si el botón no funciona, abre el enlace desde el mismo dispositivo donde recibiste este correo.</p>
  <p style="font-size:14px;color:#666">Soporte: <a href="mailto:contacto@somossuyos.com">contacto@somossuyos.com</a></p>
  <p style="font-size:13px;color:#888;margin-top:32px">— Equipo RenaSER 2026 / Somos Suyos</p>
</body>
</html>`;

  return { html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, '&#39;');
}
