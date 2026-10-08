import { useEffect, useState } from 'react';

/** Beneficio asistente solo si /api/renaser/benefit/me confirma cookie válida (no usa query params). */
export function useRenaserBenefitCart(): { benefitActive: boolean; loading: boolean } {
  const [benefitActive, setBenefitActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/renaser/benefit/me', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setBenefitActive(Boolean(json?.ok && json.benefitActive));
      })
      .catch(() => {
        if (!cancelled) setBenefitActive(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { benefitActive, loading };
}
