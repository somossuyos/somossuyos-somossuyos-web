/** Enlace privado compartido (asistentes). NO exponer en cliente. */
export function getSharedBenefitToken(): string | undefined {
  return process.env.RENASER_SHARED_BENEFIT_TOKEN?.trim() || undefined;
}

export function getBenefitSessionSecret(): string | undefined {
  return (
    process.env.RENASER_BENEFIT_SESSION_SECRET?.trim() ||
    process.env.RENASER_INVITATION_SESSION_SECRET?.trim() ||
    undefined
  );
}

export function getBenefitSessionCookieName(): string {
  return 'renaser_benefit';
}

export function getBenefitSessionTtlSeconds(): number {
  const raw = process.env.RENASER_BENEFIT_SESSION_TTL_SECONDS?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 86400 * 14;
  return Number.isFinite(n) && n >= 3600 ? Math.min(n, 86400 * 30) : 86400 * 14;
}

/** SHARED_LINK_CAN_BE_FORWARDED = YES (aceptado por negocio). */
export function buildSharedBenefitLandingUrl(): string | null {
  const token = getSharedBenefitToken();
  if (!token) return null;
  const base =
    process.env.NEXT_PUBLIC_BASE_URL?.trim()?.replace(/\/$/, '') ||
    'https://www.somossuyos.com';
  const qp = new URLSearchParams({ k: token });
  return `${base}/renaser/beneficio?${qp.toString()}`;
}
