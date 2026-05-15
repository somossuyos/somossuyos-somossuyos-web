/**
 * Lectura de variables Wompi solo en servidor (API routes, SSR).
 * En Amplify Hosting hay que inyectarlas vía `.env.production` durante el build
 * (ver `amplify.yml` y documentación AWS SSR env).
 */

/** Para logs de diagnóstico: nunca registrar el valor completo. */
export function maskEnvValue(value: string | undefined): string {
  if (value == null || value.trim() === '') return '(missing)';
  const t = value.trim();
  if (t.length <= 4) return `(set, len=${t.length})`;
  return `${t.slice(0, 2)}…${t.slice(-2)} (len=${t.length})`;
}

export function getWompiPublicKeyForServer(): string {
  return (
    process.env.WOMPI_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ||
    ''
  ).trim();
}

export function getWompiIntegritySecretForServer(): string {
  return (process.env.WOMPI_INTEGRITY_SECRET || '').trim();
}

export function shouldLogWompiEnvVerbose(): boolean {
  return process.env.WOMPI_DEBUG_ENV === 'true';
}

export function logWompiServerEnvDiagnostics(tag: string): void {
  const pk = getWompiPublicKeyForServer();
  const integ = getWompiIntegritySecretForServer();
  console.info(`[${tag}] wompi server env (masked)`, {
    WOMPI_PUBLIC_KEY: maskEnvValue(process.env.WOMPI_PUBLIC_KEY),
    NEXT_PUBLIC_WOMPI_PUBLIC_KEY: maskEnvValue(process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY),
    resolvedPublicKey: maskEnvValue(pk),
    WOMPI_INTEGRITY_SECRET: maskEnvValue(process.env.WOMPI_INTEGRITY_SECRET),
    resolvedIntegritySecret: maskEnvValue(integ),
  });
}
