/** Habilitar envío real cuando existan token Strapi y URL de privacidad aprobada. */
export function isCaminoInscriptionsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CAMINO_INSCRIPTIONS_ENABLED === 'true';
}