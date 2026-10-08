import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { CheckoutData } from '@/src/entities/CheckoutData';
import { Dispatch, SetStateAction } from 'react';

export function useRenaserInvitationCartPrefill(
  setForm: Dispatch<SetStateAction<CheckoutData>>,
): { lockEmail: boolean; emailMasked: string } {
  const router = useRouter();
  const active =
    router.query.renaserInvitacion === '1' ||
    router.query.renaserInvitacion === 'true';
  const [emailMasked, setEmailMasked] = useState('');

  useEffect(() => {
    if (!router.isReady || !active) return;
    fetch('/api/renaser/invitation/me')
      .then((r) => r.json())
      .then((json) => {
        if (!json?.ok) return;
        setEmailMasked(typeof json.emailMasked === 'string' ? json.emailMasked : '');
        setForm((prev) => ({
          ...prev,
          names: { value: json.firstName || prev.names.value, isValid: true },
          lastNames: { value: json.lastName || prev.lastNames.value, isValid: true },
          email: { value: json.emailNormalized || prev.email.value, isValid: true },
        }));
      })
      .catch(() => undefined);
  }, [router.isReady, active, setForm]);

  return { lockEmail: active, emailMasked };
}
