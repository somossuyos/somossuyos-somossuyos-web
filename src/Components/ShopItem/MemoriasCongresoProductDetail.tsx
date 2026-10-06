import ShopItemCarousel from './ShopItemCarousel';
import { formatPrice } from '@/src/utils/formatPrice';
import {
  getMemoriasCongresoCourseId,
  getMemoriasCongresoPrice,
  getMemoriasCongresoTitle,
  MEMORIAS_CONGRESO_COVER_PATH,
} from '@/src/lib/shop/memoriasCongresoCourse';
import { useAppDispatch } from '@/src/redux/hooks';
import { addItem } from '@/src/redux/features/cartSlice';
import { useRouter } from 'next/router';

type MemoriasCongresoProductDetailProps = {
  images: string[];
};

/** Alineado con `isMemoriasCongresoComingSoon()` (default: próximamente). */
const isComingSoon = process.env.NEXT_PUBLIC_MEMORIAS_COMING_SOON !== 'false';

const MemoriasCongresoProductDetail = ({ images }: MemoriasCongresoProductDetailProps) => {
  const title = getMemoriasCongresoTitle();
  const price = getMemoriasCongresoPrice();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleBuyAccess = () => {
    dispatch(
      addItem({
        id: getMemoriasCongresoCourseId(),
        thumbnail: MEMORIAS_CONGRESO_COVER_PATH,
        title,
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
    <div className="bg-white text-black py-[100px] sm:py-[140px] px-4 sm:px-8 lg:px-16 xl:px-24">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 lg:flex-row lg:gap-16 xl:gap-24">
        <div className="mx-auto w-full max-w-[420px] shrink-0 lg:max-w-[480px] lg:pt-4">
          <ShopItemCarousel
            images={images.length ? images : [MEMORIAS_CONGRESO_COVER_PATH]}
            title={title}
          />
        </div>

        <div className="min-w-0 flex-1 lg:max-w-[540px] lg:pt-2">
          <h1 className="font-stretch-pro mb-10 text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-gold sm:mb-12 sm:text-[40px] lg:text-[44px]">
            {title}
          </h1>

          <p className="font-futura mb-12 text-[34px] font-light tracking-tight text-[#1d1d1f] sm:mb-14 sm:text-[38px]">
            {formatPrice(price)}
          </p>

          <div className="mb-14 h-px w-full bg-[#e8e8ed] sm:mb-16" />

          <div className="font-futura space-y-8 text-[17px] leading-[1.75] text-[#424245] sm:space-y-10 sm:text-[18px] sm:leading-[1.8]">
            <p>
              Disfruta o revive la maravillosa experiencia de la tercera versión del Congreso Internacional
              RENASER 2026, durante el cual jóvenes, adultos, solteros, casados, consagrados, catequistas,
              acompañantes espirituales y familias compartieron los conocimientos de conferencistas nacionales
              e internacionales sobre herramientas concretas para sanar y comprender su historia afectiva y
              sexual.
            </p>
            <p>
              En estas memorias te ofrecemos las conferencias de{' '}
              <span className="font-medium text-[#1d1d1f]">Rafael Lafuente</span> (España) — Experto en
              educación afectivo-sexual, UCAM; de{' '}
              <span className="font-medium text-[#1d1d1f]">David Ramírez</span> (España) — Doctor en Medicina,
              especialista en neurociencia, psicología de la sexualidad y tratamiento de adicciones;{' '}
              <span className="font-medium text-[#1d1d1f]">Gustavo Mejía</span> (EE.UU.) — Terapeuta en Internal
              Family Systems, terapia cristiana y neurociencia;{' '}
              <span className="font-medium text-[#1d1d1f]">María Paula Aldana</span> (Colombia) — Fundadora de
              Somos Suyos, conferencista y escritora experta en teología del cuerpo y educación sexual integral;
              y de <span className="font-medium text-[#1d1d1f]">Monseñor Astolfo Moreno</span> (Colombia) —
              Sacerdote Vicario Episcopal en la Arquidiócesis de Bogotá.
            </p>
          </div>

          <div className="pt-4 sm:pt-6">
            {isComingSoon ? (
              <>
                <span className="inline-flex items-center justify-center rounded-full bg-[#f5f5f7] px-7 py-3 font-futura text-[14px] font-medium tracking-wide text-[#1d1d1f]">
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
        </div>
      </div>
    </div>
  );
};

export default MemoriasCongresoProductDetail;
