import type { NextApiRequest, NextApiResponse } from 'next';
import { isCaminoInscriptionsEnabled } from '@/src/lib/caminoDeSantiago/featureFlags';
import { validateCaminoInscriptionPayload } from '@/src/lib/caminoDeSantiago/validateInscription';
import { submitCaminoInscriptionToStrapi } from '@/src/lib/caminoDeSantiago/submitToStrapi';

type SuccessBody = { ok: true };
type ErrorBody = { ok: false; code: string; message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<SuccessBody | ErrorBody>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, code: 'method_not_allowed', message: 'Metodo no permitido.' });
  }

  if (!isCaminoInscriptionsEnabled()) {
    return res.status(503).json({
      ok: false,
      code: 'inscriptions_closed',
      message: 'Inscripciones próximamente. Estamos preparando todos los detalles de esta experiencia.',
    });
  }

  const validation = validateCaminoInscriptionPayload(req.body);
  if (!validation.ok) {
    const status = validation.code === 'spam_detected' ? 429 : 400;
    return res.status(status).json({ ok: false, code: validation.code, message: validation.message });
  }

  const strapi = await submitCaminoInscriptionToStrapi(validation.data, validation.edad);
  if (!strapi.ok) {
    if (strapi.reason === 'not_configured') {
      console.error('[camino-inscripcion] Falta API_URL o STRAPI_CAMINO_API_TOKEN');
      return res.status(503).json({
        ok: false,
        code: 'not_configured',
        message: 'Inscripciones temporalmente no disponibles. Intenta mas tarde.',
      });
    }
    if (strapi.reason === 'collection_missing') {
      console.error('[camino-inscripcion] Coleccion camino-santiago-inscripciones no existe en Strapi');
      return res.status(503).json({
        ok: false,
        code: 'collection_missing',
        message: 'Inscripciones temporalmente no disponibles. Intenta mas tarde.',
      });
    }
    console.error('[camino-inscripcion] Strapi error', { status: strapi.status, detail: strapi.detail });
    const detail = strapi.detail ?? '';
    const edadServerMismatch =
      validation.edad > 45 &&
      (detail.length === 0 || /edad|maximum|max|45|greater/i.test(detail));
    const message = edadServerMismatch
      ? 'El servidor aun esta actualizando el rango de edad (18 a 60). Si tu edad es mayor a 45 anos, intenta en unas horas o escribenos por WhatsApp con tus datos.'
      : 'No pudimos guardar tu inscripcion. Revisa fecha de nacimiento (18 a 60 anos) y telefono. Si sigue fallando, contactanos por WhatsApp.';
    return res.status(502).json({
      ok: false,
      code: edadServerMismatch ? 'edad_servidor' : 'strapi_error',
      message,
    });
  }

  return res.status(201).json({ ok: true });
}