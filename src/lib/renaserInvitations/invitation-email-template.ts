import { buildSharedBenefitLandingUrl } from '@/src/lib/renaserBenefit/config';

export const PURCHASE_INVITATION_SUBJECT = 'Memorias del Congreso RenaSER 2026';

export const PURCHASE_INVITATION_CTA_LABEL = 'Acceder a las Memorias de RenaSER 2026';

export function buildPurchaseInvitationEmail(params: {
  firstName: string;
}): { html: string; text: string } {
  const ctaUrl = buildSharedBenefitLandingUrl();
  if (!ctaUrl) {
    throw new Error('RENASER_SHARED_BENEFIT_TOKEN not configured');
  }

  const text = `Querida Comunidad Somos Suyos:

Ha llegado el momento que tanto esperabas.

Este regalo ha sido preparado especialmente para ti, que nos acompañaste en el Congreso RenaSER 2026.

Con este enlace podrás acceder al contenido completo del Congreso con un 40% de descuento.

Revive las conferencias, aprendizajes y momentos que hicieron inolvidable nuestro encuentro, y vuelve a disfrutar todo el contenido de RenaSER 2026 cuando quieras.

Esperamos verte nuevamente en la próxima edición de RenaSER.

Bendiciones,

Somos Suyos

(Si no ves el botón, abre este correo en un cliente con HTML.)`;

  const html = `<!DOCTYPE html>
<html lang="es">
<body style="font-family:Georgia,'Times New Roman',serif;color:#1d1d1f;line-height:1.65;max-width:560px;margin:0 auto;padding:24px">
  <p>Querida Comunidad Somos Suyos:</p>
  <p>Ha llegado el momento que tanto esperabas.</p>
  <p>Este regalo ha sido preparado especialmente para ti, que nos acompañaste en el Congreso RenaSER 2026.</p>
  <p>Con este enlace podrás acceder al contenido completo del Congreso con un <strong>40% de descuento</strong>.</p>
  <p style="margin:32px 0">
    <a href="${escapeAttr(ctaUrl)}" style="background:#2d4a7a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;display:inline-block;font-weight:600;font-family:system-ui,sans-serif">${escapeHtml(PURCHASE_INVITATION_CTA_LABEL)}</a>
  </p>
  <p>Revive las conferencias, aprendizajes y momentos que hicieron inolvidable nuestro encuentro, y vuelve a disfrutar todo el contenido de RenaSER 2026 cuando quieras.</p>
  <p>Esperamos verte nuevamente en la próxima edición de RenaSER.</p>
  <p>Bendiciones,</p>
  <p><strong>Somos Suyos</strong></p>
  <p style="font-size:14px;color:#666;margin-top:28px">Soporte: <a href="mailto:contacto@somossuyos.com">contacto@somossuyos.com</a></p>
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
