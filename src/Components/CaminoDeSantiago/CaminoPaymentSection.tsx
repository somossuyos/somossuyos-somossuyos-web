import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  CAMINO_CREDIT_CARD_SURCHARGE_RATE,
  CAMINO_PAYMENT_PLANS,
  type CaminoPaymentPlanId,
} from '@/src/lib/caminoDeSantiago/paymentPlans';
import type { CaminoPaymentChannel } from '@/src/lib/caminoDeSantiago/caminoWompiPricing';
import { formatPrice } from '@/src/utils/formatPrice';
import { getWompiRedirectUrlBrowser, resolveWompiPublicKeyForWidget } from '@/src/lib/wompi/clientEnv';
import type { PaymentResponseDTO } from '@/src/infrastructure/DTOs/Checkout/PaymentResponseDTO';

type LiveRate = {
  rate: number;
  fetchedAt: string;
  disclaimer: string;
  label?: string;
};

const CaminoPaymentSection = () => {
  const router = useRouter();
  const [liveRate, setLiveRate] = useState<LiveRate | null>(null);
  const [rateLoading, setRateLoading] = useState(true);
  const [planId, setPlanId] = useState<CaminoPaymentPlanId>('single');
  const [paymentChannel, setPaymentChannel] = useState<CaminoPaymentChannel>('other');
  const [names, setNames] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRate = useCallback(async () => {
    setRateLoading(true);
    try {
      const res = await fetch('/api/camino-santiago/eur-cop-rate');
      const json = (await res.json()) as LiveRate & { ok?: boolean };
      if (res.ok && json.rate) {
        setLiveRate({
          rate: json.rate,
          fetchedAt: json.fetchedAt,
          disclaimer: json.disclaimer,
          label: json.label,
        });
      } else {
        setLiveRate(null);
      }
    } catch {
      setLiveRate(null);
    } finally {
      setRateLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRate();
  }, [loadRate]);

  const selectedPlan = CAMINO_PAYMENT_PLANS.find((p) => p.id === planId)!;
  const rate = liveRate?.rate ?? null;

  const quote = useMemo(() => {
    if (!rate) return null;
    const baseCop = Math.round(selectedPlan.amountEur * rate);
    const surchargeCop =
      paymentChannel === 'credit_card'
        ? Math.round(baseCop * CAMINO_CREDIT_CARD_SURCHARGE_RATE)
        : 0;
    return { baseCop, surchargeCop, totalCop: baseCop + surchargeCop };
  }, [rate, selectedPlan.amountEur, paymentChannel]);

  const handlePay = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/camino-santiago/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          paymentChannel,
          names,
          email,
          phone,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        amountInCents?: number;
        transactionReference?: string;
        encodedIntegritySignature?: string;
        publicKey?: string;
        redirectUrl?: string | null;
      };
      if (!res.ok || !json.ok) {
        setError(json.error || 'No se pudo iniciar el pago.');
        return;
      }

      const publicKey = resolveWompiPublicKeyForWidget(json.publicKey);
      if (!publicKey || !json.amountInCents || !json.transactionReference || !json.encodedIntegritySignature) {
        setError('Configuración de pago incompleta. Intenta más tarde.');
        return;
      }

      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents: json.amountInCents,
        reference: json.transactionReference,
        publicKey,
        signature: { integrity: json.encodedIntegritySignature },
        redirectUrl: getWompiRedirectUrlBrowser(json.redirectUrl) || undefined,
        customerData: {
          email,
          fullName: names,
          phoneNumber: phone,
          phoneNumberPrefix: '+57',
        },
      });

      checkout.open((response: PaymentResponseDTO) => {
        router.push(`/confirmacion-pago?id=${response.transaction.id}`);
      });
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pago" className="scroll-mt-32 py-16 border-t border-white/10">
      <h2 className="font-stretch-pro text-pale-skin text-2xl sm:text-3xl mb-2">Pago del viaje — Wompi</h2>

      <div className="font-futura text-white/85 text-sm sm:text-base max-w-3xl mb-6 space-y-3 leading-relaxed">
        <p>
          El programa se cotiza en <strong className="text-white">euros (€)</strong>. El pago lo haces en{' '}
          <strong className="text-white">pesos colombianos (COP)</strong> por Wompi: pagas el{' '}
          <strong className="text-white">mismo valor del euro indicado</strong> (1.670 €, 459 €, etc.), expresado en pesos con el
          equivalente que publica Somos Suyos (referencia de <strong className="text-white">casas de cambio</strong>).
        </p>
        <p>
          Tarjeta de crédito: <strong className="text-white">+6&nbsp;%</strong> sobre el valor en pesos antes de abrir Wompi.
        </p>
      </div>

      <div className="rounded-xl border border-pale-skin/40 bg-white/5 px-4 py-3 mb-8 max-w-3xl text-sm font-futura text-white/90">
        {rateLoading ? (
          <p>Cargando equivalente en pesos…</p>
        ) : rate ? (
          <>
            <p>
              <strong className="text-pale-skin">Referencia Somos Suyos:</strong> 1 € = {formatPrice(Math.round(rate))} COP
              {liveRate?.label ? <span className="text-white/70"> — {liveRate.label}</span> : null}
            </p>
            {liveRate?.disclaimer ? (
              <p className="text-white/60 text-xs mt-2">{liveRate.disclaimer}</p>
            ) : null}
          </>
        ) : (
          <p className="text-red-300">
            El pago en línea no está disponible por ahora. Intenta más tarde o escribe a Somos Suyos.
            <button type="button" className="ml-2 underline text-pale-skin" onClick={() => void loadRate()}>
              Reintentar
            </button>
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl">
        <div className="space-y-4">
          <p className="font-futura text-pale-skin text-sm uppercase tracking-wide">Elige tu opción</p>
          <div className="space-y-3">
            {CAMINO_PAYMENT_PLANS.map((plan) => (
              <label
                key={plan.id}
                className={`flex gap-3 items-start p-4 rounded-xl border cursor-pointer transition-colors ${
                  planId === plan.id ? 'border-pale-skin bg-white/10' : 'border-white/15 bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="caminoPlan"
                  checked={planId === plan.id}
                  onChange={() => setPlanId(plan.id)}
                  className="mt-1"
                />
                <span>
                  <span className="font-bold text-white block">{plan.title}</span>
                  <span className="text-pale-skin text-lg">{plan.amountEur.toLocaleString('es-CO')} €</span>
                  <span className="text-white/60 text-sm block">{plan.dueLabel}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <p className="font-futura text-pale-skin text-sm uppercase tracking-wide">Medio de pago (en Wompi)</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/90 text-sm">
              <input
                type="radio"
                name="payChannel"
                checked={paymentChannel === 'other'}
                onChange={() => setPaymentChannel('other')}
              />
              PSE, débito, Nequi u otros (sin recargo 6%)
            </label>
            <label className="flex items-center gap-2 text-white/90 text-sm">
              <input
                type="radio"
                name="payChannel"
                checked={paymentChannel === 'credit_card'}
                onChange={() => setPaymentChannel('credit_card')}
              />
              Tarjeta de crédito (+6% sobre el valor en COP)
            </label>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm font-futura text-white/85 space-y-1">
            <p>
              Plan: <span className="text-pale-skin">{selectedPlan.amountEur} €</span>
              {quote ? (
                <>
                  {' '}
                  → equivalente ≈ <span className="text-pale-skin">{formatPrice(quote.baseCop)} COP</span>
                </>
              ) : null}
            </p>
            {quote && paymentChannel === 'credit_card' ? (
              <p>
                Recargo tarjeta (+6%): {formatPrice(quote.surchargeCop)} COP → Total en Wompi:{' '}
                <strong className="text-pale-skin">{formatPrice(quote.totalCop)} COP</strong>
              </p>
            ) : quote ? (
              <p>
                Total estimado en Wompi: <strong className="text-pale-skin">{formatPrice(quote.totalCop)} COP</strong>
              </p>
            ) : null}
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre completo *"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-black text-sm"
              required
            />
            <input
              type="email"
              placeholder="Correo *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-black text-sm"
              required
            />
            <input
              type="tel"
              placeholder="Celular (WhatsApp) *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-black text-sm"
              required
            />
          </div>

          {error ? <p className="text-red-400 text-sm">{error}</p> : null}

          <button
            type="button"
            disabled={loading || !names.trim() || !email.trim() || !phone.trim() || !rate}
            onClick={handlePay}
            className="w-full bg-pale-skin text-black font-bold py-3 rounded-full disabled:opacity-50"
          >
            {loading ? 'Abriendo Wompi…' : 'PAGAR CON WOMPI'}
          </button>
          <p className="text-white/50 text-xs leading-relaxed">
            Calendario cuotas: octubre–diciembre 2026 y enero 2027. Cada cuota se paga por separado eligiendo la opción
            correspondiente. Pago único: 1.670 €.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CaminoPaymentSection;