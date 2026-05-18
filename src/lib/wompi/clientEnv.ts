/**
 * Valores expuestos al navegador para el widget Wompi (clave pública y redirect).
 * Preferir `NEXT_PUBLIC_*`; se mantiene fallback a nombres legacy por `next.config.js`.
 */

export function getWompiPublicKeyBrowser(): string {
  return (
    process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ||
    process.env.WOMPI_PUBLIC_KEY ||
    ''
  ).trim();
}

/** Prioriza la clave devuelta por create-order; fallback a env del build. */
export function resolveWompiPublicKeyForWidget(serverPublicKey?: string | null): string {
  const fromApi = typeof serverPublicKey === 'string' ? serverPublicKey.trim() : '';
  if (fromApi) return fromApi;
  return getWompiPublicKeyBrowser();
}

export function getWompiRedirectUrlBrowser(serverRedirectUrl?: string | null): string {
  const fromApi = typeof serverRedirectUrl === 'string' ? serverRedirectUrl.trim() : '';
  if (fromApi) return fromApi;
  return (
    process.env.NEXT_PUBLIC_WOMPI_REDIRECT_URL ||
    process.env.WOMPI_REDIRECT_URL ||
    ''
  ).trim();
}
