/** Equivalente EUR → COP para Camino (valor en Amplify; referencia casas de cambio). */

export type EurCopRateSnapshot = {
  rate: number;
  fetchedAt: string;
  source: 'somossuyos_config';
  /** Texto corto para la UI (ej. vigencia o nota interna). */
  label?: string;
};

const PUBLIC_DISCLAIMER =
  'El pago en pesos corresponde al valor en euros del plan, con el equivalente que Somos Suyos publica según referencia de casas de cambio.';

export function getCaminoEurCopDisclaimer(): string {
  return PUBLIC_DISCLAIMER;
}

/** Equivalente vigente (Amplify: CAMINO_EUR_TO_COP_RATE). */
export function getConfiguredEurToCopRate(): EurCopRateSnapshot | null {
  const raw = process.env.CAMINO_EUR_TO_COP_RATE?.trim();
  if (!raw) return null;
  const rate = Number(raw);
  if (!Number.isFinite(rate) || rate <= 0) return null;

  const asOf = process.env.CAMINO_EUR_TO_COP_RATE_AS_OF?.trim();
  const label = process.env.CAMINO_EUR_TO_COP_RATE_LABEL?.trim();

  return {
    rate,
    fetchedAt: asOf || new Date().toISOString(),
    source: 'somossuyos_config',
    label: label || undefined,
  };
}

/** @deprecated tests */
export function clearEurCopRateCacheForTests(): void {
  /* sin caché externa */
}

export async function getLiveEurToCopRate(): Promise<EurCopRateSnapshot | null> {
  return getConfiguredEurToCopRate();
}