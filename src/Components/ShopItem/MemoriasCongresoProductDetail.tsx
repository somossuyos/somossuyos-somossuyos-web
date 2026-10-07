import ShopItemCarousel from './ShopItemCarousel';
import { formatPrice } from '@/src/utils/formatPrice';
import {
  getMemoriasCongresoCourseId,
  getMemoriasCongresoPrice,
  MEMORIAS_CONGRESO_COVER_PATH,
} from '@/src/lib/shop/memoriasCongresoCourse';
import { useAppDispatch } from '@/src/redux/hooks';
import { addItem } from '@/src/redux/features/cartSlice';
import { useRouter } from 'next/router';

const AULA_LOGIN_URL = 'https://skillcertacademy.somossuyos.com/login';

const CONFERENCISTAS = [
  {
    name: 'Rafael Lafuente',
    detail: 'España · Educación afectivo-sexual, UCAM',
  },
  {
    name: 'David Ramírez',
    detail: 'España · Medicina, neurociencia y sexualidad',
  },
  {
    name: 'Gustavo Mejía',
    detail: 'Estados Unidos · Terapia IFS y neurociencia',
  },
  {
    name: 'María Paula Aldana',
    detail: 'Colombia · Somos Suyos · teología del cuerpo',
  },
  {
    name: 'Monseñor Astolfo Romero',
    detail: 'Colombia · Arquidiócesis de Bogotá',
  },
] as const;

type MemoriasCongresoProductDetailProps = {
  images: string[];
};

/** Alineado con `isMemoriasCongresoComingSoon()` (default: próximamente). */
const isComingSoon = process.env.NEXT_PUBLIC_MEMORIAS_COMING_SOON !== 'false';

const MemoriasCongresoProductDetail = ({ images }: MemoriasCongresoProductDetailProps) => {
  const price = getMemoriasCongresoPrice();
  const cartTitle = 'Memoria en video del Congreso RenaSER 2026';
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleBuyAccess = () => {
    dispatch(
      addItem({
        id: getMemoriasCongresoCourseId(),
        thumbnail: MEMORIAS_CONGRESO_COVER_PATH,
        title: cartTitle,
        type: 'course',
        price,
        quantity: 1,
        size: '',
        color: '',
        category: {
          name: 'Curso',
          shippingCost: 0,
        },
      }),
    );
    router.push('/carrito');
  };

  return (
    <div className="bg-[#f5f5f7] py-[100px] text-black sm:py-[120px] px-4 sm:px-8 lg:px-16 xl:px-24">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 lg:flex-row lg:gap-16 xl:gap-24">
        <div className="mx-auto w-full max-w-[420px] shrink-0 lg:max-w-[480px] lg:pt-4">
          <ShopItemCarousel
            images={images.length ? images : [MEMORIAS_CONGRESO_COVER_PATH]}
            title={cartTitle}
          />
        </div>

        <div className="min-w-0 flex-1 lg:max-w-[560px] lg:pt-2">
          <header className="mb-10 sm:mb-12">
            <p className="font-futura mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#b8956a]">
              Memoria en video
            </p>
            <h1 className="font-stretch-pro mb-4 text-[32px] font-normal leading-[1.12] tracking-[-0.02em] text-black sm:text-[38px] lg:text-[42px]">
              Congreso Internacional RENASER 2026
            </h1>
            <p className="font-futura mb-4 text-[15px] font-semibold uppercase leading-snug tracking-[0.04em] text-[#2d4a7a] sm:text-[16px]">
              Sexualidad, afectividad y teología del cuerpo
            </p>
            <p className="font-futura text-[15px] text-[#6e6e73]">
              Bogotá, Colombia · 18–19 de julio de 2026
            </p>
          </header>

          <div className="font-futura mb-10 space-y-6 text-[17px] leading-[1.75] text-[#424245] sm:mb-12 sm:text-[18px] sm:leading-[1.8]">
            <p>
              Revive la tercera edición del congreso: jóvenes, adultos, familias, consagrados y
              acompañantes encontraron herramientas concretas para sanar y comprender su historia
              afectiva y sexual, junto a conferencistas de Colombia, España y Estados Unidos.
            </p>
            <p>
              Esta aula reúne las conferencias íntegras del encuentro presencial, para verlas cuando
              quieras y a tu ritmo.
            </p>
          </div>

          <section className="mb-12 sm:mb-14">
            <h2 className="font-futura mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#aeaeb2]">
              Conferencistas
            </h2>
            <ul className="space-y-3">
              {CONFERENCISTAS.map((speaker) => (
                <li
                  key={speaker.name}
                  className="rounded-2xl border border-[#e5e5ea] bg-white px-5 py-4 shadow-sm shadow-black/[0.03]"
                >
                  <p className="font-futura text-[17px] font-semibold leading-snug text-[#1d1d1f]">
                    {speaker.name}
                  </p>
                  <p className="font-futura mt-1 text-[15px] leading-snug text-[#6e6e73]">
                    {speaker.detail}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <p className="font-futura mb-8 text-[34px] font-light tracking-tight text-[#1d1d1f] sm:text-[38px]">
            {formatPrice(price)}
          </p>

          <div className="mb-10 sm:mb-12">
            {isComingSoon ? (
              <>
                <span className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 font-futura text-[14px] font-medium tracking-wide text-[#1d1d1f] ring-1 ring-[#e5e5ea]">
                  Próximamente
                </span>
                <p className="mt-5 max-w-md font-futura text-[14px] leading-relaxed text-[#86868b]">
                  Muy pronto podrás adquirir un acceso digital desde esta página.
                </p>
              </>
            ) : (
              <button
                type="button"
                onClick={handleBuyAccess}
                className="inline-flex items-center justify-center rounded-full bg-pale-skin px-10 py-3 font-futura text-[14px] font-bold tracking-wide text-black transition-opacity hover:opacity-90"
              >
                Comprar acceso
              </button>
            )}
          </div>

          <p className="font-futura text-center text-[15px] text-[#6e6e73] lg:text-left">
            ¿Aún no tienes acceso?{' '}
            <a
              href={AULA_LOGIN_URL}
              className="font-medium text-[#2d4a7a] underline decoration-[#2d4a7a]/30 underline-offset-2 transition-colors hover:text-[#1e3a5f] hover:decoration-[#1e3a5f]/50"
            >
              Ingresa al aula virtual
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemoriasCongresoProductDetail;
