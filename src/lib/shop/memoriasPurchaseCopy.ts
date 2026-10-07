/** Textos de la zona de compra RenaSER (Memorias). Centralizados para tests. */

export const MEMORIAS_PURCHASE_SECTION_TITLE = 'Elige tu tipo de acceso';

export const MEMORIAS_PURCHASE_SECTION_SUBTITLE =
  'Tenemos una tarifa especial para quienes participaron en RenaSER 2026.';

export const MEMORIAS_ATTENDEE_EYEBROW = 'PARA ASISTENTES';
export const MEMORIAS_ATTENDEE_TITLE = 'Ya asistí a RenaSER 2026';
export const MEMORIAS_ATTENDEE_DESCRIPTION =
  'Accede a una tarifa especial para adquirir las memorias en video del Congreso.';
export const MEMORIAS_ATTENDEE_CTA = 'Comprar con descuento';
export const MEMORIAS_ATTENDEE_BADGE = 'Tarifa especial';

export const MEMORIAS_GENERAL_EYEBROW = 'ACCESO GENERAL';
export const MEMORIAS_GENERAL_TITLE = 'No asistí al Congreso';
export const MEMORIAS_GENERAL_DESCRIPTION =
  'Obtén acceso completo a las memorias en video de RenaSER 2026.';
export const MEMORIAS_GENERAL_CTA = 'Comprar acceso';
export const MEMORIAS_GENERAL_PRICE_LABEL = 'Precio regular';
export const MEMORIAS_ATTENDEE_PRICE_LABEL = 'Tarifa especial';

export const MEMORIAS_ATTENDEE_MODAL_TITLE = 'Verifica tu asistencia';
export const MEMORIAS_ATTENDEE_MODAL_INTRO =
  'Ingresa el correo electrónico que utilizaste para registrarte en RenaSER 2026.';
export const MEMORIAS_ATTENDEE_MODAL_EMAIL_LABEL = 'Correo electrónico';
export const MEMORIAS_ATTENDEE_MODAL_CTA = 'Verificar mi asistencia';
export const MEMORIAS_ATTENDEE_MODAL_FOOTNOTE =
  'Si encontramos tu registro, podrás continuar con la tarifa especial para asistentes.';

/** Mensaje genérico tras enviar verificación (sin enumeración de usuarios). */
export const MEMORIAS_ATTENDEE_VERIFICATION_PENDING_MESSAGE =
  'Recibimos tu solicitud. Si encontramos tu registro como asistente, te indicaremos cómo continuar con la tarifa especial. La verificación automática se activará pronto.';

/** Texto eliminado de la ficha — no debe aparecer en la zona de compra. */
export const MEMORIAS_REMOVED_AULA_ACCESS_SNIPPETS = [
  '¿Aún no tienes acceso?',
  'Ingresa al aula virtual',
] as const;

export const MEMORIAS_PURCHASE_LAYOUT = {
  tierGridClass: 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5',
} as const;
