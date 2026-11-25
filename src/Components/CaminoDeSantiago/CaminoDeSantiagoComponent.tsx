import Image from 'next/image';
import Link from 'next/link';
import { caminoDeSantiagoContent } from '@/src/lib/caminoDeSantiago/content';
import { isCaminoInscriptionsEnabled } from '@/src/lib/caminoDeSantiago/featureFlags';
import CaminoInscriptionForm from './CaminoInscriptionForm';
import CaminoInscriptionsComingSoon from './CaminoInscriptionsComingSoon';
import CaminoCommunityActions from './CaminoCommunityActions';
import CaminoPaymentSection from './CaminoPaymentSection';
import { getCaminoWhatsAppActionUrl } from '@/src/lib/caminoDeSantiago/whatsappLinks';

const { hero, inscription, community } = caminoDeSantiagoContent;

const CaminoDeSantiagoComponent = () => {
  const inscriptionsOpen = isCaminoInscriptionsEnabled();
  const scrollToInterest = () => {
    document.getElementById('registro')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <section className="pt-[140px] sm:pt-[180px] xl:pt-[220px] pb-16 px-4 sm:px-[8%] xl:px-[120px]">
        <div className="grid xl:grid-cols-2 gap-10 xl:gap-16 items-center">
          <div className="min-w-0 [container-type:inline-size]">
            <p className="font-futura text-pale-skin text-sm tracking-[0.2em] uppercase mb-4">SOMOS SUYOS 2027</p>
            <h1 className="font-stretch-pro text-[clamp(1.75rem,11.2cqi,4rem)] leading-[0.95] tracking-[-0.02em]">
              <span className="block">PEREGRINACIÓN</span>
              <span className="block">CAMINO DE</span>
              <span className="block">SANTIAGO +</span>
              <span className="block">FÁTIMA</span>
            </h1>
            <p className="font-dark-twenty text-pale-skin text-[28px] sm:text-[40px] xl:text-[52px] leading-none mt-2 mb-4">
              5 al 12 de Junio 2027
            </p>
            <p className="font-futura text-white text-lg sm:text-xl mb-2">“CAMINA POR TU VOCACIÓN”</p>
            <p className="font-futura text-white/80 text-base sm:text-lg max-w-xl mb-8">
              EXPERIENCIA DE SENDERISMO ESPIRITUAL CON SOMOS SUYOS
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <a
                href={getCaminoWhatsAppActionUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white font-bold px-10 py-3 rounded-full text-sm sm:text-base hover:opacity-90 transition-opacity text-center"
              >
                {community.whatsappGroupLabel}
              </a>
              <button
                type="button"
                onClick={scrollToInterest}
                className="bg-pale-skin text-black font-bold px-10 py-3 rounded-full text-sm sm:text-base hover:opacity-90 transition-opacity"
              >
                {inscriptionsOpen ? hero.ctaLabel : 'INSCRIPCIONES PROXIMAMENTE'}
              </button>
            </div>
          </div>
          <div className="relative w-full max-w-[520px] mx-auto xl:max-w-none aspect-[4/5] rounded-[24px] overflow-hidden border border-white/10 shadow-nav">
            {hero.imageUrl ? (
              <Image
                src={hero.imageUrl}
                alt={hero.imageAlt}
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1280px) 100vw, (max-width: 1536px) 45vw, 520px"
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#2a2622] via-[#1a1816] to-black flex flex-col items-center justify-center px-8 text-center"
                aria-label={hero.imageAlt}
              >
                <span className="font-dark-twenty text-pale-skin text-4xl sm:text-5xl mb-2">+</span>
                <p className="font-futura text-white/70 text-sm sm:text-base max-w-sm">
                  Imagen representativa del Camino de Santiago — se publicara proximamente.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-[8%] xl:px-[120px] font-futura text-white/90 text-base leading-relaxed max-w-4xl">
        <p className="mb-4">Un verano INOLVIDABLE en Portugal y España:</p>
        <ul className="list-disc pl-5 space-y-2 mb-8">
          <li>Retiro en Fátima</li>
          <li>6 Etapas del Camino de Santiago Portugués Central</li>
          <li>Llegada a Santiago de Compostela en el año JACOBEO</li>
          <li>Acompañamiento espiritual- Padre Luis Ángel Espinosa</li>
        </ul>
        <p className="mb-3">PRECIO POR PERSONA: 1.670 Euros</p>
        <p className="mb-2">Incluye:</p>
        <p className="mb-6">
          Alojamiento Desayunos Traslados terrestres Seguro de asistencia Kit del Peregrino SOMOS SUYOS Catequesis y
          audios del retiro guiado Eucaristías Acompañamiento espiritual con el Padre Luis Angel Espinosa LC y María
          Paula Aldana.
        </p>
        <p className="mb-8">
          Nuestro itinerario espiritual girará en torno al discernimiento, confirmación o crisis de tu vocación personal
          desde la Teología del cuerpo.
        </p>
        <h2 className="font-stretch-pro text-pale-skin text-2xl mb-4">SERVICIOS INCLUIDOS</h2>
        <ul className="list-disc pl-5 space-y-2 mb-8">
          <li>Alojamiento en Hoteles/Pazos/Casas Rurales/Hostales/Pensiones con encanto, en habitación doble con baño privado.</li>
          <li>Desayunos</li>
          <li>Traslado de equipaje entre etapas (1 maleta por persona, máximo 20kg)</li>
          <li>Dossier Digital de la ruta</li>
          <li>Seguro de asistencia en viaje</li>
          <li>Asistencia telefónica en ruta</li>
          <li>Vehículo de asistencia en ruta, en caso de urgencia</li>
          <li>Obsequios: Vieira y credencial del peregrino</li>
          <li>Impuestos incluidos</li>
          <li>Traslados terrestres Desde Lisboa hasta Santiago de Compostela y regreso de Santiago de Compostela a Madrid.</li>
          <li>Itinerario espiritual (Jornadas guiadas en cada etapa del Camino)</li>
          <li>Kit de Peregrino SOMOS SUYOS: (camiseta, agenda, lapicero, carnet del peregrino, Material de acompañamiento -para ejercicios y talleres)</li>
          <li>Audios del retiro guiado y acceso a las grabaciones.</li>
          <li>Acompañamiento espiritual por parte de SOMOS SUYOS: (MARÍA PAULA ALDANA Y EL PADRE LUIS ANGEL ESPINOSA LC)</li>
          <li>Eucaristía y acompañamiento Sacerdotal (Confesiones).</li>
        </ul>
        <h2 className="font-stretch-pro text-pale-skin text-2xl mb-4">NO INCLUYE:</h2>
        <ul className="list-disc pl-5 space-y-2 mb-8">
          <li>Tiquetes aéreos, traslados desde y hacia el aeropuerto.</li>
          <li>Almuerzos y cenas no indicadas en el itinerario</li>
          <li>Gastos personales</li>
          <li>Tour o visitas guiadas no descritas en el plan</li>
          <li>Equipaje adicional, trámites de documentos de viaje u otros servicios no especificados en el plan.</li>
          <li>Edad: 18 a 45 años.</li>
        </ul>
        <h2 className="font-stretch-pro text-pale-skin text-2xl mb-4">ITINERARIO:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Día 1: Salida desde Lisboa y traslado terrestre a Fátima (Alojamiento)</li>
          <li>Día 2: Fátima: Eucaristía, inicio del retiro espiritual. (Estaremos en Fátima hasta el medio día) Salida de Fátima a Tui. Alojamiento en Tui.</li>
          <li>Día 3: Etapa Tui – Redondela . Alojamiento</li>
          <li>Día 4: Etapa Redondela – Pontevedra. Alojamiento.</li>
          <li>Día 5: Etapa Pontevedra – Caldas de Reis . Alojamiento.</li>
          <li>Día 6: Etapa Caldas de Reis – Padrón. Alojamiento.</li>
          <li>Día 7: Etapa Padrón – Santiago de Compostela. Alojamiento.</li>
          <li>Día 8: Desayuno Santiago de Compostela, salida hacia Madrid en transporte terrestre.</li>
        </ul>
      </section>

      <section className="px-4 sm:px-[8%] xl:px-[120px]">
        <CaminoPaymentSection />
      </section>

      <section className="py-20 px-4 sm:px-[8%] xl:px-[120px]">
        <div className="max-w-4xl">
          <h2 className="font-stretch-pro text-[22px] sm:text-[32px] text-pale-skin mb-2">{inscription.title}</h2>
          {inscriptionsOpen ? (
            <p className="font-futura text-white/80 text-base mb-10">{inscription.subtitle}</p>
          ) : null}
          {inscriptionsOpen ? <CaminoInscriptionForm /> : <CaminoInscriptionsComingSoon />}
          <p className="font-futura text-sm text-white/50 mt-8">
            Dudas generales:{' '}
            <Link href="/contacto" className="text-pale-skin underline underline-offset-2">
              Contacto
            </Link>
          </p>
        </div>
      </section>

      <section id="comunidad-whatsapp" className="py-14 px-4 sm:px-[8%] xl:px-[120px] border-t border-white/10">
        <div className="max-w-4xl">
          <h2 className="font-stretch-pro text-[22px] sm:text-[32px] text-pale-skin mb-6">
            Comunidad WhatsApp — Camino y Fátima SOS
          </h2>
          <CaminoCommunityActions variant="dark" />
        </div>
      </section>
    </div>
  );
};

export default CaminoDeSantiagoComponent;