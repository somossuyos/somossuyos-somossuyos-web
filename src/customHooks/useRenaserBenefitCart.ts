import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useRenaserBenefitCart(): { benefitActive: boolean; loading: boolean } {
  const router = useRouter();
  const hint =
    router.query.renaserBeneficio === '1' || router.query.renaserBeneficio === 'true';
  const [benefitActive, setBenefitActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    fetch('/api/renaser/benefit/me')
      .then((r) => r.json())
      .then((json) => {
        setBenefitActive(Boolean(json?.ok && json.benefitActive));
      })
      .catch(() => setBenefitActive(false))
      .finally(() => setLoading(false));
  }, [router.isReady, hint]);

  return { benefitActive, loading };
}
