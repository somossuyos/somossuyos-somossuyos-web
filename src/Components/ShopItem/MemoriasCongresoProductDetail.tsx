import ShopItemCarousel from './ShopItemCarousel';
import { formatPrice } from '@/src/utils/formatPrice';
import {
  getMemoriasCongresoPrice,
  getMemoriasCongresoTitle,
  MEMORIAS_CONGRESO_COVER_PATH,
} from '@/src/lib/shop/memoriasCongresoCourse';

type MemoriasCongresoProductDetailProps = {
  images: string[];
};

const MemoriasCongresoProductDetail = ({ images }: MemoriasCongresoProductDetailProps) => {
  const title = getMemoriasCongresoTitle();
  const price = getMemoriasCongresoPrice();

  return (
    <div className="bg-white text-black py-[100px] sm:py-[150px] px-4 sm:px-[75px] xl:px-[200px] 2xl:px-[300px]">
      <p className="text-[#8B8B8B] pb-[30px] hidden sm:block font-futura text-sm tracking-wide">
        Tienda · Curso · {title}
      </p>
      <div className="flex flex-col lg:flex-row justify-center gap-[40px] xl:gap-x-[90px] max-w-6xl mx-auto">
        <ShopItemCarousel images={images.length ? images : [MEMORIAS_CONGRESO_COVER_PATH]} title={title} />
        <div className="pt-5 lg:flex-1 lg:max-w-xl">
          <p className="font-futura text-xs sm:text-sm uppercase tracking-[0.2em] text-[#989898] mb-3">
            Curso digital
          </p>

          <div className="rounded-[24px] border border-[#EBEBEB] bg-[#faf8f5] px-5 py-6 sm:px-7 sm:py-8 mb-6">
            <p className="font-futura text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gold mb-2">
              Congreso Internacional RENASER 2026
            </p>
            <p className="font-stretch-pro text-[15px] sm:text-[17px] leading-snug text-black/90 mb-3">
              Sexualidad, afectividad y teología del cuerpo
            </p>
            <p className="font-futura text-[13px] sm:text-[14px] text-[#666]">
              Bogotá – Colombia · 18-19 de julio de 2026
            </p>
          </div>

          <h1 className="font-stretch-pro text-[28px] sm:text-[34px] xl:text-[38px] leading-[1.1] text-gold mb-4">
            {title}
          </h1>

          <p className="font-futura text-[#989898] text-[32px] sm:text-[36px] font-light mb-8">
            {formatPrice(price)}
          </p>

          <div className="font-futura text-[16px] sm:text-[17px] leading-relaxed text-[#444] space-y-5 mb-10">
            <p>
              Disfruta o revive la maravillosa experiencia de la tercera versión del Congreso Internacional
              RENASER 2026, durante el cual jóvenes, adultos, solteros, casados, consagrados, catequistas,
              acompañantes espirituales y familias compartieron los conocimientos de conferencistas nacionales
              e internacionales sobre herramientas concretas para sanar y comprender su historia afectiva y
              sexual.
            </p>
            <p>
              En estas memorias te ofrecemos las conferencias de{' '}
              <strong>Rafael Lafuente</strong> (España) — Experto en educación afectivo-sexual, UCAM; de{' '}
              <strong>David Ramírez</strong> (España) — Doctor en Medicina, especialista en neurociencia,
              psicología de la sexualidad y tratamiento de adicciones; <strong>Gustavo Mejía</strong> (EE.UU.) —
              Terapeuta en Internal Family Systems, terapia cristiana y neurociencia;{' '}
              <strong>María Paula Aldana</strong> (Colombia) — Fundadora de Somos Suyos, conferencista y escritora
              experta en teología del cuerpo y educación sexual integral; y de{' '}
              <strong>Monseñor Astolfo Moreno</strong> (Colombia) — Sacerdote Vicario Episcopal en la Arquidiócesis
              de Bogotá.
            </p>
          </div>

          <span className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border-2 border-pale-skin bg-black px-8 py-3.5 font-stretch-pro text-[15px] sm:text-[16px] uppercase tracking-wide text-pale-skin">
            Próximamente
          </span>
          <p className="font-futura text-[13px] text-[#989898] mt-4">
            Muy pronto podrás adquirir un acceso digital desde esta página.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemoriasCongresoProductDetail;
