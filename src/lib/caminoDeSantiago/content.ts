/**
 * Contenido editable de la landing Camino de Santiago.
 * Completar campos con `value` cuando estén confirmados; `null` muestra "Por confirmar".
 */
export type CaminoTripField = {
  id: string;
  label: string;
  value: string | null;
  hint?: string;
};

export const caminoDeSantiagoContent = {
  hero: {
    title: 'CAMINO DE SANTIAGO',
    subtitle: 'Una experiencia de fe, encuentro y transformación.',
    ctaLabel: 'QUIERO MÁS INFORMACIÓN',
    /** URL de imagen en CMS/S3 cuando esté disponible; null usa placeholder visual */
    imageUrl: null as string | null,
    imageAlt: 'Camino de Santiago — peregrinación',
  },
  presentation: {
    title: 'Un viaje que invita al corazón',
    paragraphs: [
      'Somos Suyos te invita a vivir el Camino de Santiago como una peregrinación espiritual y cultural: un tiempo para caminar, orar, escuchar y encontrarte con Dios, contigo mismo y con una comunidad de fe.',
      'Más que un recorrido por España, es una experiencia de conversión cotidiana: cada paso como oración, cada encuentro como gracia, cada jornada como oportunidad de crecimiento personal y fraternidad.',
    ],
  },
  experience: {
    title: 'La experiencia',
    items: [
      { title: 'Peregrinación y reflexión', description: 'Ritmo de caminata que favorece la oración y el silencio interior.' },
      { title: 'Experiencias espirituales', description: 'Momentos de Eucaristía, testimonio y acompañamiento pastoral.' },
      { title: 'Encuentro con otros peregrinos', description: 'Comunidad viva en el camino, con personas que comparten la misma búsqueda.' },
      { title: 'Cultura e historia de España', description: 'Patrimonio, gastronomía y raíces cristianas del Camino francés y sus variantes.' },
      { title: 'Comunidad y crecimiento personal', description: 'Vivir la fe en grupo, con espacios de conversación y servicio.' },
    ],
  },
  tripDetails: {
    title: 'Información del viaje',
    intro:
      'Los detalles logísticos se publicarán en esta sección a medida que el itinerario quede confirmado. La estructura ya está preparada para actualizar fechas, ruta y valores.',
    fields: [
      { id: 'departure', label: 'Fecha de salida', value: null },
      { id: 'duration', label: 'Duración', value: null },
      { id: 'route', label: 'Ruta del Camino', value: null },
      { id: 'cities', label: 'Ciudades', value: null },
      { id: 'lodging', label: 'Alojamiento', value: null },
      { id: 'included', label: 'Servicios incluidos', value: null },
      { id: 'recommendations', label: 'Recomendaciones', value: null },
      { id: 'price', label: 'Valor del viaje', value: null },
    ] satisfies CaminoTripField[],
  },
  inscription: {
    title: 'FORMULARIO DE INSCRIPCION — CAMINO DE SANTIAGO',
    subtitle: 'Inscripcion de personas interesadas en participar en la experiencia Camino de Santiago, Espana.',
    ageNotice: 'Aplica para personas de 18 a 45 anos (edad calculada desde la fecha de nacimiento).',
    /** URL oficial aprobada vía NEXT_PUBLIC_CAMINO_PRIVACY_POLICY_URL; vacío = enlace deshabilitado hasta publicar política */
    privacyPolicyHref: '',
    successTitle: '¡Tu inscripcion fue recibida!',
    successMessage:
      'Gracias por tu interes en vivir la experiencia Camino de Santiago con Somos Suyos. Hemos recibido tus datos y el equipo encargado podra comunicarse contigo para ampliar la informacion. Esto no confirma cupo ni reserva definitiva.',
  },
  seo: {
    title: 'Camino de Santiago',
    description:
      'Viaje espiritual y cultural al Camino de Santiago con Somos Suyos. Peregrinación, fe, comunidad e historia. Solicita más información.',
    canonicalPath: '/camino-de-santiago',
  },
} as const;

export function formatTripFieldValue(value: string | null): string {
  return value?.trim() ? value.trim() : 'Por confirmar';
}

/** Política de tratamiento de datos para el checkbox del formulario (no usar /contacto). */
export function getCaminoPrivacyPolicyHref(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CAMINO_PRIVACY_POLICY_URL?.trim();
  if (fromEnv) return fromEnv;
  const fromContent = caminoDeSantiagoContent.inscription.privacyPolicyHref?.trim();
  return fromContent ?? '';
}