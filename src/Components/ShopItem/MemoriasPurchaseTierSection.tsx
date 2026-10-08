import React from 'react';
import { formatPrice } from '@/src/utils/formatPrice';
import { getMemoriasRegularPriceCop } from '@/src/lib/shop/memoriasCongresoPricing';
import {
  MEMORIAS_GENERAL_CTA,
  MEMORIAS_GENERAL_DESCRIPTION,
  MEMORIAS_GENERAL_EYEBROW,
  MEMORIAS_GENERAL_PRICE_LABEL,
  MEMORIAS_GENERAL_TITLE,
  MEMORIAS_PURCHASE_LAYOUT,
  MEMORIAS_PURCHASE_SECTION_SUBTITLE,
  MEMORIAS_PURCHASE_SECTION_TITLE,
} from '@/src/lib/shop/memoriasPurchaseCopy';

type MemoriasPurchaseTierSectionProps = {
  comingSoon: boolean;
  onGeneralPurchase: () => void;
};

const MemoriasPurchaseTierSection = ({
  comingSoon,
  onGeneralPurchase,
}: MemoriasPurchaseTierSectionProps) => {
  const regularPrice = getMemoriasRegularPriceCop();

  return (
    <section className="mb-10 sm:mb-12" aria-labelledby="memorias-purchase-heading">
      <h2
        id="memorias-purchase-heading"
        className="font-futura mb-2 text-[22px] font-semibold tracking-tight text-[#1d1d1f] sm:text-[24px]"
      >
        {MEMORIAS_PURCHASE_SECTION_TITLE}
      </h2>
      <p className="font-futura mb-6 max-w-lg text-[15px] leading-relaxed text-[#6e6e73]">
        {MEMORIAS_PURCHASE_SECTION_SUBTITLE}
      </p>

      {comingSoon ? (
        <>
          <span className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 font-futura text-[14px] font-medium tracking-wide text-[#1d1d1f] ring-1 ring-[#e5e5ea]">
            Próximamente
          </span>
          <p className="mt-5 max-w-md font-futura text-[14px] leading-relaxed text-[#86868b]">
            Muy pronto podrás adquirir un acceso digital desde esta página.
          </p>
        </>
      ) : (
        <div className={MEMORIAS_PURCHASE_LAYOUT.tierGridClass}>
          <article className="flex flex-col rounded-2xl border border-[#e5e5ea] bg-white p-5 shadow-sm shadow-black/[0.03] sm:p-6">
            <p className="font-futura mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#aeaeb2]">
              {MEMORIAS_GENERAL_EYEBROW}
            </p>
            <h3 className="font-futura mb-2 text-[19px] font-semibold leading-snug text-[#1d1d1f]">
              {MEMORIAS_GENERAL_TITLE}
            </h3>
            <p className="font-futura mb-4 flex-1 text-[15px] leading-relaxed text-[#6e6e73]">
              {MEMORIAS_GENERAL_DESCRIPTION}
            </p>
            <p className="font-futura mb-5 text-[13px] text-[#86868b]">
              {MEMORIAS_GENERAL_PRICE_LABEL}{' '}
              <span className="text-[22px] font-light tracking-tight text-[#1d1d1f]">
                {formatPrice(regularPrice)}
              </span>
            </p>
            <button
              type="button"
              onClick={onGeneralPurchase}
              className="w-full rounded-full bg-pale-skin px-6 py-3 font-futura text-[14px] font-bold tracking-wide text-black transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8956a] focus-visible:ring-offset-2"
            >
              {MEMORIAS_GENERAL_CTA}
            </button>
          </article>
        </div>
      )}
    </section>
  );
};

export default MemoriasPurchaseTierSection;
