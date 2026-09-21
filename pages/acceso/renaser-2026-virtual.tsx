import Head from 'next/head';
import Link from 'next/link';

const STREAM_URL = process.env.NEXT_PUBLIC_RENASER_VIRTUAL_STREAM_URL?.trim() || '';
const hasStream = STREAM_URL.length > 0;

const Renaser2026VirtualAccessPage = () => {
  return (
    <>
      <Head>
        <title>Acceso virtual Congreso RenaSER 2026 — Somos Suyos</title>
        <meta
          name="description"
          content="Enlace de acceso virtual al Congreso RenaSER 2026."
        />
      </Head>
      <div className="min-h-screen bg-white text-black pt-[120px] sm:pt-[180px] pb-16 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="font-futura text-sm uppercase tracking-widest text-[#989898] mb-3">
            Somos Suyos
          </p>
          <h1 className="font-stretch-pro text-[28px] sm:text-[42px] leading-tight text-gold mb-6">
            Acceso virtual — Congreso RenaSER 2026
          </h1>

          {!hasStream ? (
            <>
              <span className="inline-block mb-6 rounded-full border-2 border-pale-skin bg-black px-5 py-2 font-futura text-sm font-bold uppercase tracking-wide text-pale-skin">
                Enlace en preparación
              </span>
              <div className="rounded-[24px] border-2 border-pale-skin bg-[#faf8f5] px-6 py-8 sm:px-8 sm:py-10 mb-8">
                <p className="font-stretch-pro text-[22px] sm:text-[26px] leading-tight text-gold mb-4">
                  ¡Gracias por tu compra!
                </p>
                <p className="font-futura text-[18px] sm:text-[21px] leading-relaxed text-[#333] mb-4">
                  El Congreso RenaSER 2026 será los días <strong>18 y 19 de julio de 2026</strong>.
                  Guarda este enlace: aquí podrás ingresar a la transmisión en vivo cuando la
                  habilitemos.
                </p>
                <p className="font-futura text-[16px] sm:text-[18px] leading-relaxed text-[#666] mb-4">
                  Si no pudiste asistir al congreso de forma presencial, este enlace es tu acceso
                  virtual a la transmisión en vivo.
                </p>
                <p className="font-futura text-[16px] sm:text-[18px] leading-relaxed text-[#666]">
                  Te enviamos este mismo enlace por correo. Revisa tu bandeja de entrada y spam
                  cerca de la fecha del evento.
                </p>
              </div>
            </>
          ) : (
            <>
              <span className="inline-block mb-6 rounded-full border-2 border-gold bg-pale-skin px-5 py-2 font-futura text-sm font-bold uppercase tracking-wide text-black">
                Transmisión disponible
              </span>
              <p className="font-futura text-[18px] sm:text-[21px] leading-relaxed mb-8">
                Usa el botón siguiente para ingresar a la transmisión virtual del Congreso RenaSER
                2026.
              </p>
              <a
                href={STREAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-center rounded-[28px] border-2 border-pale-skin bg-black px-8 py-4 font-stretch-pro text-[18px] sm:text-[20px] text-pale-skin mb-8"
              >
                Ingresar a la transmisión
              </a>
            </>
          )}

          <Link
            href="/"
            className="inline-block rounded-full bg-pale-skin px-8 py-3 font-futura font-bold text-black"
          >
            Volver al sitio
          </Link>
        </div>
      </div>
    </>
  );
};

export default Renaser2026VirtualAccessPage;
