import { caminoDeSantiagoContent } from './content';

const DEFAULT_SOS_WHATSAPP_NUMBER = '573223885754';

/** Rutas donde el botón flotante usa la configuración Camino. */
export function isCaminoWhatsAppContext(pathname: string): boolean {
  return pathname === '/camino-de-santiago' || pathname.startsWith('/camino-de-santiago');
}

export function getCaminoFormPublicUrl(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || 'https://www.somossuyos.com';
  return `${base}${caminoDeSantiagoContent.seo.canonicalPath}#registro`;
}

export function getCaminoWhatsAppGroupUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CAMINO_WHATSAPP_GROUP_URL?.trim();
  return url || null;
}

export function getCaminoPaymentUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CAMINO_PAYMENT_URL?.trim();
  return url || null;
}

/** Texto para descripción del grupo, wa.me prefill o mensaje de bienvenida (configurar también en WhatsApp). */
export function buildCaminoWelcomeMessage(webinarDate?: string | null): string {
  const formUrl = getCaminoFormPublicUrl();
  const fecha =
    webinarDate?.trim() ||
    caminoDeSantiagoContent.community.webinarDate?.trim() ||
    'Por confirmar';
  return [
    'Bienvenido a la Peregrinación del Camino de Santiago y Fátima SOS!',
    '',
    'Para recibir toda la información de nuestra peregrinación, por favor diligencia el siguiente formulario:',
    formUrl,
    '',
    'Únete a nuestro webinar informativo donde te explicaremos todo el proceso con detalle.',
    `Fecha: ${fecha}`,
  ].join('\n');
}

/** Enlace wa.me con mensaje prellenado (útil en redes si aún no hay grupo). */
export function getCaminoWhatsAppPrefillChatUrl(): string {
  const text = encodeURIComponent(buildCaminoWelcomeMessage());
  return `https://wa.me/${DEFAULT_SOS_WHATSAPP_NUMBER}?text=${text}`;
}

/**
 * Destino del botón flotante / CTA principal: grupo si está configurado; si no, chat con texto Camino.
 */
export function getCaminoWhatsAppActionUrl(): string {
  return getCaminoWhatsAppGroupUrl() ?? getCaminoWhatsAppPrefillChatUrl();
}

export function getDefaultSiteWhatsAppUrl(): string {
  return 'https://wa.me/573223885754?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20Somos%20Suyos.%20Gracias';
}