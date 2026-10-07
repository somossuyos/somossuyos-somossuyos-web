import React, { useRef, useState } from 'react';
import { formatPrice } from '@/src/utils/formatPrice';
import {
  getMemoriasAttendeePriceCop,
  getMemoriasRegularPriceCop,
} from '@/src/lib/shop/memoriasCongresoPricing';
import {
  MEMORIAS_ATTENDEE_BADGE,
  MEMORIAS_ATTENDEE_PRICE_LABEL,
  MEMORIAS_ATTENDEE_CTA,
  MEMORIAS_ATTENDEE_DESCRIPTION,
  MEMORIAS_ATTENDEE_EYEBROW,
  MEMORIAS_ATTENDEE_TITLE,
  MEMORIAS_GENERAL_CTA,
  MEMORIAS_GENERAL_DESCRIPTION,
  MEMORIAS_GENERAL_EYEBROW,
  MEMORIAS_GENERAL_PRICE_LABEL,
  MEMORIAS_GENERAL_TITLE,
  MEMORIAS_PURCHASE_LAYOUT,
  MEMORIAS_PURCHASE_SECTION_SUBTITLE,
  MEMORIAS_PURCHASE_SECTION_TITLE,
} from '@/src/lib/shop/memoriasPurchaseCopy';
import MemoriasAttendeeVerificationModal from './MemoriasAttendeeVerificationModal';

type MemoriasPurchaseTierSectionProps = {
  comingSoon: boolean;
  onGeneralPurchase: () => void;
};

const MemoriasPurchaseTierSection = ({
  comingSoon,
  onGeneralPurchase,
}: MemoriasPurchaseTierSectionProps) => {
  const regularPrice = getMemoriasRegularPriceCop();
  const attendeePrice = getMemoriasAttendeePriceCop();
  const attendeeTriggerRef = useRef<HTMLButtonElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
          <article className="flex flex-col rounded-2xl border-2 border-[#2d4a7a]/25 bg-white p-5 shadow-sm shadow-[#2d4a7a]/5 sm:p-6">
            <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-futura text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b8956a]">
                {MEMORIAS_ATTENDEE_EYEBROW}
              </p>
              <span className="inline-flex shrink-0 rounded-full bg-[#2d4a7a]/10 px-1.5 py-px font-futura text-[8px] font-medium uppercase leading-tight tracking-[0.04em] text-[#2d4a7a]">
                {MEMORIAS_ATTENDEE_BADGE}
              </span>
            </div>
            <h3 className="font-futura mb-2 text-[19px] font-semibold leading-snug text-[#1d1d1f]">
              {MEMORIAS_ATTENDEE_TITLE}
            </h3>
            <p className="font-futura mb-4 flex-1 text-[15px] leading-relaxed text-[#6e6e73]">
              {MEMORIAS_ATTENDEE_DESCRIPTION}
            </p>
            <p className="font-futura mb-5 text-[13px] text-[#86868b]">
              {MEMORIAS_ATTENDEE_PRICE_LABEL}{' '}
              <span className="text-[22px] font-light tracking-tight text-[#2d4a7a]">
                {formatPrice(attendeePrice)}
              </span>
            </p>
            <button
              ref={attendeeTriggerRef}
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full rounded-full bg-[#2d4a7a] px-6 py-3 font-futura text-[14px] font-bold tracking-wide text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d4a7a] focus-visible:ring-offset-2"
            >
              {MEMORIAS_ATTENDEE_CTA}
            </button>
          </article>

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

      <MemoriasAttendeeVerificationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        returnFocusRef={attendeeTriggerRef}
      />
    </section>
  );
};

export default MemoriasPurchaseTierSection;
