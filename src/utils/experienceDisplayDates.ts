import { formatDates } from './formatDates';

/**
 * Cuando en Strapi `Fecha` no coincide con el periodo real del evento (p. ej. material gráfico),
 * se fuerza el mes (y el día en detalle) a partir de una fecha ISO de referencia.
 * Quitar la entrada cuando el CMS esté alineado.
 */
const DISPLAY_DATE_ISO_BY_EXPERIENCE_ID: Record<number, string> = {
  8: '2026-05-31T12:00:00.000Z',
};

export function experienceMonthLabel(
  experienceId: number,
  fecha: string | Date | null | undefined
): string {
  const override = DISPLAY_DATE_ISO_BY_EXPERIENCE_ID[experienceId];
  if (override) {
    return formatDates(override);
  }
  if (fecha === null || fecha === undefined) {
    return '';
  }
  return formatDates(fecha);
}

export function experienceDayOfMonth(
  experienceId: number,
  fecha: string | Date | null | undefined
): number {
  const override = DISPLAY_DATE_ISO_BY_EXPERIENCE_ID[experienceId];
  const source = override ?? fecha;
  const d = new Date(source as string | Date);
  return d.getDate();
}
