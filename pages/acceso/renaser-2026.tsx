import Head from 'next/head';
import Link from 'next/link';

/**
 * Página pública de acceso a la grabación RenaSER 2026.
 *
 * Seguridad (v1): enlace común para todos los compradores — sin tokens ni login.
 * Una fase futura podría emitir enlaces únicos por compra vía webhook/metadata Wompi.
 */
const RENASER_VIDEO_URL = process.env.NEXT_PUBLIC_RENASER_VIDEO_URL?.trim() || '';
const isVideoAvailable = RENASER_VIDEO_URL.length > 0;

const Renaser2026AccessPage = () => {
  return (
    <>
      <Head>
        <title>Grabación Congreso RenaSER 2026 — Somos Suyos</title>
        <meta
          name="description"
          content="Acceso digital a la grabación del Congreso RenaSER 2026."
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
                Próximamente disponible
              </span>
              <p className="font-futura text-[18px] sm:text-[21px] leading-relaxed mb-8">
                Gracias por tu compra. La grabación del Congreso RenaSER 2026 estará disponible a
                finales de julio de 2026. Guarda este enlace para acceder cuando el contenido sea
                habilitado.
              </p>
            </>
          ) : (
            <>
              <span className="inline-block mb-6 rounded-full border-2 border-gold bg-pale-skin px-5 py-2 font-futura text-sm font-bold uppercase tracking-wide text-black">
                Disponible
              </span>
              <p className="font-futura text-[18px] sm:text-[21px] leading-relaxed mb-8">
                La grabación del Congreso RenaSER 2026 ya está disponible. Puedes verla en línea o
                descargarla desde los botones siguientes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href={RENASER_VIDEO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-center rounded-[28px] border-2 border-pale-skin bg-black px-8 py-4 font-stretch-pro text-[18px] sm:text-[20px] text-pale-skin"
                >
                  Ver grabación
                </a>
                <a
                  href={RENASER_VIDEO_URL}
                  download
                  className="inline-block text-center rounded-[28px] border-2 border-black bg-pale-skin px-8 py-4 font-stretch-pro text-[18px] sm:text-[20px] text-black"
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
