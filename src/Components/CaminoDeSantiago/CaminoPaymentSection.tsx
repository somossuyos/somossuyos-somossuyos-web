import { useState } from 'react';
import { useRouter } from 'next/router';
import { type CaminoPaymentPlanId } from '@/src/lib/caminoDeSantiago/paymentPlans';
import type { CaminoPaymentChannel } from '@/src/lib/caminoDeSantiago/caminoWompiPricing';
import { getWompiRedirectUrlBrowser, resolveWompiPublicKeyForWidget } from '@/src/lib/wompi/clientEnv';
import type { PaymentResponseDTO } from '@/src/infrastructure/DTOs/Checkout/PaymentResponseDTO';

const CaminoPaymentSection = () => {
  const router = useRouter();
  const [planId, setPlanId] = useState<CaminoPaymentPlanId>('single');
  const [creditCard, setCreditCard] = useState(false);
  const [names, setNames] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentChannel: CaminoPaymentChannel = creditCard ? 'credit_card' : 'other';

  const handlePay = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/camino-santiago/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, paymentChannel, names, email, phone }),
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
    <section id="pago" className="scroll-mt-32 py-16 border-t border-white/10 font-futura text-white/90">
      <h2 className="font-stretch-pro text-pale-skin text-2xl sm:text-3xl mb-4">RESERVAS Y FORMAS DE PAGO:</h2>
      <ul className="list-disc pl-5 space-y-3 mb-6 max-w-3xl">
        <li>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="caminoPlan"
              className="mr-2"
              checked={planId === 'single'}
              onChange={() => setPlanId('single')}
            />
            Un único pago: 1.670 € (Hasta el 20 de diciembre)
          </label>
        </li>
        <li>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="caminoPlan"
              className="mr-2"
              checked={planId === 'installments'}
              onChange={() => setPlanId('installments')}
            />
            Pago a cuotas:
          </label>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Pago 1: 505 € (Inscripción y reserva del cupo) – Hasta el 20 de diciembre de 2026</li>
            <li>Pago 2: 405 € - Hasta el 20 de enero de 2027</li>
            <li>Pago 3: 405 € – Hasta el 20 de febrero de 2027</li>
            <li>Pago 4: 405 € - Hasta el 20 de Marzo de 2027</li>
          </ul>
        </li>
      </ul>
      <div className="space-y-3 max-w-3xl mb-8 text-sm sm:text-base leading-relaxed">
        <p>El pago se recibe a la TRM vigente en casas de cambio al momento de realizar cada pago.</p>
        <p>*** Cupos limitados.</p>
        <p>
          El cupo sólo será garantizado una vez sea efectuado el primer pago. Se debe enviar comprobante de pago, foto
          del pasaporte y nombre de la persona que viajará al correo: contacto@somossuyos.com
        </p>
        <p>Métodos de pago: Pago en línea a través de la página de SOMOS SUYOS.</p>
        <p>** Pagos con tarjeta de crédito tiene un recargo adicional del 6%</p>
        <p>** Términos y condiciones disponibles en el grupo de whatsapp</p>
        <p>Diligencia el formulario y recibe toda la información completa.</p>
      </div>

      <label className="flex items-start gap-2 mb-6 max-w-3xl text-sm">
        <input type="checkbox" className="mt-1" checked={creditCard} onChange={(e) => setCreditCard(e.target.checked)} />
        Pago con tarjeta de crédito (recargo adicional del 6%)
      </label>

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
        onClick={handlePay}
        className="bg-pale-skin text-black font-bold px-10 py-3 rounded-full disabled:opacity-50"
      >
        {loading ? 'Abriendo pago…' : 'PAGAR'}
      </button>
    </section>
  );
};

export default CaminoPaymentSection;
