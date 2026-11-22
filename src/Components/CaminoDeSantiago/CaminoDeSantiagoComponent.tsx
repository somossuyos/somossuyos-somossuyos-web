import Image from 'next/image';
import Link from 'next/link';
import { caminoDeSantiagoContent, formatTripFieldValue } from '@/src/lib/caminoDeSantiago/content';
import CaminoInscriptionForm from './CaminoInscriptionForm';

const { hero, presentation, experience, tripDetails, inscription } = caminoDeSantiagoContent;

const CaminoDeSantiagoComponent = () => {
  const scrollToInterest = () => {
    document.getElementById('registro')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <section className="pt-[140px] sm:pt-[180px] xl:pt-[220px] pb-16 px-4 sm:px-[8%] xl:px-[120px]">
        <div className="grid xl:grid-cols-2 gap-10 xl:gap-16 items-center">
          <div>
            <p className="font-futura text-pale-skin text-sm tracking-[0.2em] uppercase mb-4">Eventos · Viajes</p>
            <h1 className="font-stretch-pro text-[28px] sm:text-[42px] xl:text-[56px] leading-tight">
              {hero.title}
            </h1>
            <p className="font-dark-twenty text-pale-skin text-[32px] sm:text-[48px] xl:text-[64px] leading-none mt-2 mb-6">
              {hero.subtitle}
            </p>
            <p className="font-futura text-white/80 text-base sm:text-lg max-w-xl mb-8">
              Un camino por España que une oracion, cultura y fraternidad. Informacion del itinerario en actualizacion.
            </p>
            <button
              type="button"
              onClick={scrollToInterest}
              className="bg-pale-skin text-black font-bold px-10 py-3 rounded-full text-sm sm:text-base hover:opacity-90 transition-opacity"
            >
              {hero.ctaLabel}
            </button>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden border border-white/10 shadow-nav">
            {hero.imageUrl ? (
              <Image src={hero.imageUrl} alt={hero.imageAlt} fill className="object-cover" priority sizes="(max-width: 1280px) 100vw, 50vw" />
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

      <section className="py-16 px-4 sm:px-[8%] xl:px-[120px] bg-white text-black">
        <h2 className="font-stretch-pro text-[24px] sm:text-[36px] mb-6">{presentation.title}</h2>
        <div className="grid md:grid-cols-2 gap-8 font-futura text-base sm:text-lg leading-relaxed text-black/85">
          {presentation.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-[8%] xl:px-[120px]">
        <h2 className="font-stretch-pro text-[24px] sm:text-[36px] mb-10 text-pale-skin">{experience.title}</h2>
        <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {experience.items.map((item) => (
            <li
              key={item.title}
              className="rounded-[20px] border border-white/10 bg-white/5 p-6 hover:border-pale-skin/40 transition-colors"
            >
              <h3 className="font-dark-twenty text-pale-skin text-2xl mb-3">{item.title}</h3>
              <p className="font-futura text-sm sm:text-base text-white/80">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="informacion" className="py-16 px-4 sm:px-[8%] xl:px-[120px] bg-pale-skin text-black">
        <h2 className="font-stretch-pro text-[24px] sm:text-[36px] mb-4">{tripDetails.title}</h2>
        <p className="font-futura text-base mb-10 max-w-3xl">{tripDetails.intro}</p>
        <dl className="grid sm:grid-cols-2 gap-6">
          {tripDetails.fields.map((field) => (
            <div key={field.id} className="rounded-[16px] bg-black/5 px-5 py-4 border border-black/10">
              <dt className="font-futura text-xs uppercase tracking-wide text-black/60 mb-1">{field.label}</dt>
              <dd className="font-futura text-base sm:text-lg font-medium">{formatTripFieldValue(field.value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="py-20 px-4 sm:px-[8%] xl:px-[120px]">
        <div className="max-w-4xl">
          <h2 className="font-stretch-pro text-[22px] sm:text-[32px] text-pale-skin mb-2">{inscription.title}</h2>
          <p className="font-futura text-white/80 text-base mb-10">{inscription.subtitle}</p>
          <CaminoInscriptionForm />
          <p className="font-futura text-sm text-white/50 mt-8">
            Dudas generales:{' '}
            <Link href="/contacto" className="text-pale-skin underline underline-offset-2">
              Contacto
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export default CaminoDeSantiagoComponent;