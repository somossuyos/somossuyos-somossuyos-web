import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { CheckoutData } from '@/src/entities/CheckoutData';
import { Dispatch, SetStateAction } from 'react';

export function useRenaserInvitationCartPrefill(
  setForm: Dispatch<SetStateAction<CheckoutData>>,
): { lockEmail: boolean } {
  const router = useRouter();
  const active =
    router.query.renaserInvitacion === '1' ||
    router.query.renaserInvitacion === 'true';

  useEffect(() => {
    if (!router.isReady || !active) return;
    fetch('/api/renaser/invitation/me')
      .then((r) => r.json())
      .then((json) => {
        if (!json?.ok) return;
        setForm((prev) => ({
          ...prev,
          names: { value: json.firstName || prev.names.value, isValid: true },
          lastNames: { value: json.lastName || prev.lastNames.value, isValid: true },
          email: { value: json.emailNormalized || prev.email.value, isValid: true },
        }));
      })
      .catch(() => undefined);
  }, [router.isReady, active, setForm]);

  return { lockEmail: active };
}
