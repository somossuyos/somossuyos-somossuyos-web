import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { caminoBiblicoContent } from '@/src/lib/caminoBiblico/content';
import {
  CAMINO_BIBLICO_BIZUM,
  CAMINO_BIBLICO_BIZUM_CONTACT,
  CAMINO_BIBLICO_COVER_PATH,
  CAMINO_BIBLICO_EUR_ES,
  CAMINO_BIBLICO_PAYPAL_URL,
  CAMINO_BIBLICO_PAYPAL_USD,
  CAMINO_BIBLICO_PRICE_COP,
  CAMINO_BIBLICO_WHATSAPP_CHANNEL_URL,
} from '@/src/lib/caminoBiblico/product';
import { getWompiRedirectUrlBrowser, resolveWompiPublicKeyForWidget } from '@/src/lib/wompi/clientEnv';
import type { PaymentResponseDTO } from '@/src/infrastructure/DTOs/Checkout/PaymentResponseDTO';

const formatCop = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const CaminoBiblicoProductPage = () => {
  const router = useRouter();
  const { hero, intro, plusTitle, plusIntro, plusItems, purchaseSectionTitle, pricing } =
    caminoBiblicoContent;
  const [names, setNames] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWompiPay = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/camino-biblico/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names, email, phone }),
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
        setError('No se pudo iniciar el pago.');
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
    <div className="bg-black text-white min-h-screen pt-[120px] sm:pt-[150px] pb-20 px-4 sm:px-[8%] xl:px-[120px]">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16">
          <div className="relative w-full max-w-md mx-auto lg:max-w-none aspect-[4/5] rounded-[24px] overflow-hidden border border-white/10">
            <Image
              src={CAMINO_BIBLICO_COVER_PATH}
              alt={hero.title}
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>
          <div className="font-futura">
            <p className="text-pale-skin text-sm uppercase tracking-[0.15em] mb-3">INFO WEB DE LA EXPERIENCIA</p>
            <h1 className="font-stretch-pro text-3xl sm:text-4xl text-white mb-3 leading-tight">{hero.title}</h1>
            <p className="text-lg sm:text-xl text-pale-skin mb-8">{hero.subtitle}</p>
            <ul className="list-disc pl-5 space-y-2 mb-6 text-white/90">
              {intro.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <a
              href={CAMINO_BIBLICO_WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366] text-white font-bold px-8 py-3 rounded-full text-sm hover:opacity-90 mb-10"
            >
              Canal de WhatsApp — cartilla y audios
            </a>
            <p className="font-stretch-pro text-pale-skin text-xl mb-2">{plusTitle}</p>
            <p className="mb-4 text-white/90 leading-relaxed">{plusIntro}</p>
            <ul className="space-y-2 mb-2 font-bold">
              {plusItems.map((item) => (
                <li key={item}>🔥{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <section id="comprar" className="scroll-mt-28 border-t border-white/10 pt-12 font-futura">
          <h2 className="font-stretch-pro text-2xl text-pale-skin mb-8">{purchaseSectionTitle}</h2>

          <PricingOption title={`1. ${pricing.wompiLabel}`} amount={pricing.wompiAmount}>
            <p className="text-white/70 text-sm mb-4">
              Valor en pesos colombianos: {formatCop(CAMINO_BIBLICO_PRICE_COP)}
            </p>
            <div className="space-y-3 max-w-md mb-4">
              <input
                type="text"
                placeholder="Nombre completo *"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-black text-sm"
              />
              <input
                type="email"
                placeholder="Correo *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-black text-sm"
              />
              <input
                type="tel"
                placeholder="Celular *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-black text-sm"
              />
            </div>
            {error ? <p className="text-red-400 text-sm mb-3">{error}</p> : null}
            <button
              type="button"
              disabled={loading || !names.trim() || !email.trim() || !phone.trim()}
              onClick={handleWompiPay}
              className="bg-pale-skin text-black font-bold px-10 py-3 rounded-full disabled:opacity-50"
            >
              {loading ? 'Abriendo pago…' : 'PAGAR CON WOMPI'}
            </button>
          </PricingOption>

          <PricingOption title={`2. ${pricing.paypalLabel}`} amount={`$${CAMINO_BIBLICO_PAYPAL_USD} USD`}>
            <a
              href={CAMINO_BIBLICO_PAYPAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-2 border-pale-skin text-pale-skin font-bold px-10 py-3 rounded-full hover:bg-pale-skin/10"
            >
              Pagar con PayPal
            </a>
          </PricingOption>

          <PricingOption title={`3. ${pricing.europeLabel}`} amount={`${CAMINO_BIBLICO_EUR_ES} €`}>
            <p className="text-white/90">
              Bizum {CAMINO_BIBLICO_BIZUM}
              <br />
              {CAMINO_BIBLICO_BIZUM_CONTACT}
            </p>
          </PricingOption>
        </section>
      </div>
    </div>
  );
};

function PricingOption({
  title,
  amount,
  children,
}: {
  title: string;
  amount: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <h3 className="font-stretch-pro text-lg text-white mb-1">{title}</h3>
      <p className="text-pale-skin font-bold mb-4">Valor: {amount}</p>
      {children}
    </div>
  );
}

export default CaminoBiblicoProductPage;