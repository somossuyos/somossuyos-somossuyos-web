import { AULA_VIRTUAL_URL, buildInvitationLandingUrl } from './config';

export type RenaserInvitationEmailContent = {
  subject: string;
  text: string;
  html: string;
};

export function buildRenaserInvitationEmail(params: {
  firstName: string;
  invitationUrl: string;
}): RenaserInvitationEmailContent {
  const subject = 'RenaSER 2026 – Acceso exclusivo a la memoria en video';
  const greeting = params.firstName.trim() ? `Hola ${params.firstName},` : 'Hola,';
  const text = `${greeting}

Fuiste seleccionado/a para acceder a la memoria en video del Congreso Internacional RenaSER 2026.

Usa el botón de este correo para abrir tu acceso personal y completar la compra con el correo autorizado.

${params.invitationUrl}

Si necesitas ayuda, escríbenos a contacto@somossuyos.com.

RenaSER 2026 · Somos Suyos
Aula virtual: ${AULA_VIRTUAL_URL}
`;

  const html = `<!DOCTYPE html><html lang="es"><body style="font-family:system-ui,sans-serif;color:#1d1d1f;line-height:1.6">
<p>${greeting}</p>
<p>Fuiste seleccionado/a para acceder a la <strong>memoria en video</strong> del Congreso Internacional RenaSER 2026.</p>
<p>El enlace es personal y está asociado a tu correo. Solo podrás completar <strong>una compra</strong>.</p>
<p style="margin:28px 0">
  <a href="${params.invitationUrl}" style="background:#2d4a7a;color:#fff;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600">
    Acceder a RenaSER 2026
  </a>
</p>
<p style="font-size:14px;color:#6e6e73">Si el botón no funciona, copia este enlace en tu navegador:<br/>${params.invitationUrl}</p>
<p style="font-size:14px;color:#6e6e73">Soporte: <a href="mailto:contacto@somossuyos.com">contacto@somossuyos.com</a></p>
</body></html>`;

  return { subject, text, html };
}

export function invitationUrlFromToken(token: string): string {
  return buildInvitationLandingUrl(token);
}
