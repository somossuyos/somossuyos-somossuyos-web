import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  buildMemoriasCartItemForTier,
  MEMORIAS_CART_TITLE,
} from '@/src/lib/shop/memoriasGeneralCheckout';
import { getMemoriasCongresoPrice } from '@/src/lib/shop/memoriasCongresoCourse';
import { useAppDispatch } from '@/src/redux/hooks';
import { addItem } from '@/src/redux/features/cartSlice';
import { AULA_VIRTUAL_URL } from '@/src/lib/renaserInvitations/config';

type MeState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready';
      firstName: string;
      lastName: string;
      emailMasked: string;
    };

export default function RenaserInvitacionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [me, setMe] = useState<MeState>({ status: 'loading' });
  const [exchanging, setExchanging] = useState(false);

  const loadMe = useCallback(async () => {
    const res = await fetch('/api/renaser/invitation/me');
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) {
      setMe({
        status: 'error',
        message:
          typeof json?.error === 'string'
            ? json.error
            : 'La invitación no es válida o ya no está disponible.',
      });
      return;
    }
    setMe({
      status: 'ready',
      firstName: json.firstName,
      lastName: json.lastName,
      emailMasked: json.emailMasked,
    });
  }, []);

  useEffect(() => {
    const token = typeof router.query.t === 'string' ? router.query.t : '';
    if (!router.isReady) return;

    if (token) {
      setExchanging(true);
      fetch('/api/renaser/invitation/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then(async (res) => {
          const json = await res.json().catch(() => null);
          if (!res.ok || !json?.ok) {
            setMe({
              status: 'error',
              message:
                typeof json?.error === 'string'
                  ? json.error
                  : 'La invitación no es válida o ya no está disponible.',
            });
            return;
          }
          router.replace('/renaser/invitacion', undefined, { shallow: true });
          await loadMe();
        })
        .finally(() => setExchanging(false));
      return;
    }

    loadMe();
  }, [router.isReady, router.query.t, router, loadMe]);

  const goToCheckout = () => {
    const item = buildMemoriasCartItemForTier('GENERAL');
    if (!item) return;
    dispatch(addItem(item));
    router.push('/carrito?renaserInvitacion=1');
  };

  const price = getMemoriasCongresoPrice();

  return (
    <>
      <Head>
        <title>RenaSER 2026 — Invitación | Somos Suyos</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="mx-auto max-w-xl px-6 py-16 font-futura text-[#1d1d1f]">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">Acceso exclusivo RenaSER 2026</h1>
        <p className="mb-8 text-[#6e6e73]">{MEMORIAS_CART_TITLE}</p>

        {exchanging || me.status === 'loading' ? (
          <p className="text-[#6e6e73]">Validando invitación…</p>
        ) : null}

        {me.status === 'error' ? (
          <div className="space-y-6">
            <p className="rounded-lg bg-[#f5f5f7] p-4 text-[15px]">{me.message}</p>
            {me.message.includes('ya fue utilizada') ? (
              <Link
                href={AULA_VIRTUAL_URL}
                className="inline-block rounded-full bg-[#2d4a7a] px-6 py-3 text-white"
              >
                Ir al aula virtual
              </Link>
            ) : null}
          </div>
        ) : null}

        {me.status === 'ready' ? (
          <div className="space-y-6">
            <p className="text-lg">
              Hola {me.firstName}, tu acceso está asociado a{' '}
              <strong>{me.emailMasked}</strong>.
            </p>
            <p className="text-[15px] text-[#6e6e73]">
              Memoria en video del Congreso RenaSER 2026 — {price.toLocaleString('es-CO')} COP
              (pago único).
            </p>
            <button
              type="button"
              onClick={goToCheckout}
              className="w-full rounded-full bg-[#2d4a7a] px-6 py-3 text-white sm:w-auto"
            >
              Continuar al pago
            </button>
          </div>
        ) : null}
      </main>
    </>
  );
}
