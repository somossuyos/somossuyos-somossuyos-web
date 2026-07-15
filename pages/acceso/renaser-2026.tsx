import Head from 'next/head';
import Link from 'next/link';

/**
 * Página de acceso a la grabación RenaSER 2026 (enlace enviado tras compra Wompi).
 * El video se habilita a finales de julio de 2026; hasta entonces muestra estado "en proceso".
 */
const RENASER_VIDEO_URL = process.env.NEXT_PUBLIC_RENASER_VIDEO_URL?.trim() || '';

/** Disponible desde finales de julio 2026 (zona Colombia). */
const RENASER_VIDEO_RELEASE_AT = new Date('2026-08-01T05:00:00.000Z');

const isVideoAvailable =
  RENASER_VIDEO_URL.length > 0 && Date.now() >= RENASER_VIDEO_RELEASE_AT.getTime();

const Renaser2026AccessPage = () => {
  return (
    <>
      <Head>
        <title>Grabación Congreso RenaSER 2026 — Somos Suyos</title>
        <meta
          name="description"
          content="Tu acceso a la grabación del Congreso RenaSER 2026."
        />
      </Head>
      <div className="min-h-screen bg-white text-black pt-[120px] sm:pt-[180px] pb-16 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="font-futura text-sm uppercase tracking-widest text-[#989898] mb-3">
            Somos Suyos
          </p>
          <h1 className="font-stretch-pro text-[28px] sm:text-[42px] leading-tight text-gold mb-6">
            Grabación Congreso RenaSER 2026
          </h1>

          {!isVideoAvailable ? (
            <>
              <span className="inline-block mb-6 rounded-full border-2 border-pale-skin bg-black px-5 py-2 font-futura text-sm font-bold uppercase tracking-wide text-pale-skin">
                En proceso
              </span>

              <div className="rounded-[24px] border-2 border-pale-skin bg-[#faf8f5] px-6 py-8 sm:px-8 sm:py-10 mb-8">
                <p className="font-stretch-pro text-[22px] sm:text-[26px] leading-tight text-gold mb-4">
                  ¡Gracias por tu compra!
                </p>
                <p className="font-futura text-[18px] sm:text-[21px] leading-relaxed text-[#333] mb-4">
                  Estamos muy emocionados de compartir contigo la grabación del Congreso RenaSER
                  2026, realizado los 18 y 19 de julio.
                </p>
                <p className="font-futura text-[18px] sm:text-[21px] leading-relaxed text-[#333] mb-4">
                  Ahora mismo estamos preparando el video en nuestra plataforma. Estará listo para
                  descargar a <strong>finales de julio de 2026</strong>.
                </p>
                <p className="font-futura text-[16px] sm:text-[18px] leading-relaxed text-[#666]">
                  Guarda este enlace: cuando el video esté habilitado, aquí podrás{' '}
                  <strong>descargarlo</strong> a tu dispositivo. No estará disponible para ver en
                  línea, solo para descarga.
                </p>
              </div>
            </>
          ) : (
            <>
              <span className="inline-block mb-6 rounded-full border-2 border-gold bg-pale-skin px-5 py-2 font-futura text-sm font-bold uppercase tracking-wide text-black">
                Listo para descargar
              </span>

              <div className="rounded-[24px] border-2 border-pale-skin bg-[#faf8f5] px-6 py-8 sm:px-8 sm:py-10 mb-8">
                <p className="font-stretch-pro text-[22px] sm:text-[26px] leading-tight text-gold mb-4">
                  ¡Ya está listo!
                </p>
                <p className="font-futura text-[18px] sm:text-[21px] leading-relaxed text-[#333] mb-6">
                  La grabación del Congreso RenaSER 2026 ya está disponible. Estamos felices de que
                  formes parte de esta experiencia. Descárgala y guárdala en tu dispositivo — no
                  está habilitada la reproducción en línea.
                </p>
                <a
                  href={RENASER_VIDEO_URL}
                  download
                  className="inline-block text-center rounded-[28px] border-2 border-pale-skin bg-black px-8 py-4 font-stretch-pro text-[18px] sm:text-[20px] text-pale-skin transition-opacity hover:opacity-90"
                >
                  Descargar grabación
                </a>
              </div>
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

export default Renaser2026AccessPage;
