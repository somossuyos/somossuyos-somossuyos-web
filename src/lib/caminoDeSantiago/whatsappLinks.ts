import { caminoDeSantiagoContent } from './content';

const DEFAULT_SOS_WHATSAPP_NUMBER = '573223885754';

/** Invitación oficial grupo Peregrinación Camino de Santiago y Fátima SOS (público). */
export const CAMINO_WHATSAPP_GROUP_URL_DEFAULT =
  'https://chat.whatsapp.com/LZtFDpH4ype95N0tt0DJ6k?s=cl&p=a&iam=2';

/** Rutas donde el botón flotante usa la configuración Camino. */
export function isCaminoWhatsAppContext(pathname: string): boolean {
  return pathname === '/camino-de-santiago' || pathname.startsWith('/camino-de-santiago');
}

export function getCaminoFormPublicUrl(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || 'https://www.somossuyos.com';
  return `${base}${caminoDeSantiagoContent.seo.canonicalPath}#registro`;
}

export function getCaminoWhatsAppGroupUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CAMINO_WHATSAPP_GROUP_URL?.trim();
  return fromEnv || CAMINO_WHATSAPP_GROUP_URL_DEFAULT;
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
  return getCaminoWhatsAppGroupUrl();
}

export function getDefaultSiteWhatsAppUrl(): string {
  return 'https://wa.me/573223885754?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20Somos%20Suyos.%20Gracias';
}

/** Mensaje al chat oficial Somos Suyos (reserva / pago), no al grupo del Camino. */
export const CAMINO_RESERVATION_WHATSAPP_MESSAGE =
  'Hola, quiero reservar mi cupo para el Camino de Santiago';

/** Chat Somos Suyos (573223885754) con texto de reserva — CTA «QUIERO HACER MI PAGO». */
export function getCaminoPaymentRequestWhatsAppUrl(): string {
  const number =
    process.env.NEXT_PUBLIC_CAMINO_PAYMENT_WHATSAPP_NUMBER?.replace(/\D/g, '') ||
    DEFAULT_SOS_WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodeURIComponent(CAMINO_RESERVATION_WHATSAPP_MESSAGE)}`;
}