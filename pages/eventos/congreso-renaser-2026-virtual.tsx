import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  buildRenaserVirtualCartItem,
  getRenaserVirtualPrice,
  RENASER_VIRTUAL_TITLE,
} from '@/src/lib/wompi/renaserVirtualCongress';
import { RENASER_RECORDING_COVER_PATH } from '@/src/lib/wompi/renaserRecording';
import { addItem } from '@/src/redux/features/cartSlice';
import { useAppDispatch } from '@/src/redux/hooks';
import { formatPrice } from '@/src/utils/formatPrice';

const DESCRIPTION_INTRO =
  'Si no pudiste ir al Congreso RenaSER 2026 de forma presencial, puedes tener acceso virtual los días 18 y 19 de julio de 2026.';

const DESCRIPTION_AVAILABILITY =
  'Cada compra incluye un acceso (una persona). Después de pagar recibirás un correo con el enlace para ingresar a la transmisión en vivo.';

const RenaserVirtualCongressSalesPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const price = getRenaserVirtualPrice();

  const handleBuy = () => {
    dispatch(addItem(buildRenaserVirtualCartItem()));
    router.push('/carrito');
  };

  return (
    <>
      <Head>
        <title>{RENASER_VIRTUAL_TITLE} — Somos Suyos</title>
        <meta
          name="description"
          content="Compra acceso virtual al Congreso RenaSER 2026."
        />
      </Head>

      <div className="bg-white text-black pt-[150px] sm:pt-[200px] xl:pt-[250px] pb-16 px-4 sm:px-8 xl:px-[100px] 2xl:px-[160px]">
        <div className="flex flex-col md:flex-row gap-10 xl:gap-16 max-w-7xl mx-auto">
          <div className="relative self-center md:self-start w-full max-w-[420px] sm:max-w-[500px] md:max-w-[540px] lg:max-w-[620px] xl:max-w-[680px] flex-shrink-0 md:flex-1">
            <img
              src={RENASER_RECORDING_COVER_PATH}
              alt={`Portada de ${RENASER_VIRTUAL_TITLE}`}
              width={800}
              height={800}
              className="rounded-[20px] overflow-hidden object-cover w-full aspect-square border border-pale-skin p-2 md:p-0 md:border-0"
            />
          </div>

          <div className="font-futura flex-1 max-w-xl md:max-w-md lg:max-w-lg">
            <p className="text-[#989898] text-sm uppercase tracking-wide mb-2">
              Congreso virtual
            </p>
            <h1 className="font-stretch-pro text-[28px] sm:text-[36px] xl:text-[42px] leading-tight text-gold mb-4">
              {RENASER_VIRTUAL_TITLE}
            </h1>

            <span className="inline-block mb-4 rounded-full border-2 border-pale-skin bg-black px-4 py-1.5 font-futura text-xs font-bold uppercase tracking-wide text-pale-skin">
              18 y 19 de julio de 2026
            </span>

            {price > 0 && (
              <p className="text-[#989898] text-[32px] sm:text-[36px] font-light my-4">
                {formatPrice(price)}
              </p>
            )}

            <p className="text-[18px] sm:text-[21px] leading-relaxed text-[#333] mb-4">
              {DESCRIPTION_INTRO}
            </p>
            <p className="text-[18px] sm:text-[21px] leading-relaxed text-[#333] mb-8">
              {DESCRIPTION_AVAILABILITY}
            </p>

            <div className="flex flex-col gap-3 w-fit">
              <button
                type="button"
                onClick={handleBuy}
                className="rounded-[20px] border-2 border-pale-skin bg-black px-6 py-2.5 font-stretch-pro text-[14px] sm:text-[15px] text-pale-skin text-center transition-opacity hover:opacity-90"
              >
                Comprar ahora
              </button>
            </div>

            <p className="mt-8 text-sm text-[#989898]">
              Un acceso por compra. Tras tu pago recibirás un correo con el enlace de la transmisión.
            </p>

            <Link
              href="/eventos"
              className="inline-block mt-6 text-gold underline font-futura text-sm"
            >
              Ver más experiencias
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RenaserVirtualCongressSalesPage;
