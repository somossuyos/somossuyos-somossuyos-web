import { formatPrice } from '@/src/utils/formatPrice';
import { calculateRenaserInvitationPricing } from '@/src/lib/renaserInvitations/pricing';

const RenaserInvitationPricingSummary = () => {
  const p = calculateRenaserInvitationPricing();
  return (
    <div className="sm:col-span-2 mb-4 rounded-lg border border-[#2d4a7a]/20 bg-[#f5f5f7] p-4 font-futura text-[15px] text-[#1d1d1f]">
      <p className="mb-3 font-semibold text-[#2d4a7a]">Beneficio exclusivo RenaSER 2026</p>
      <dl className="space-y-2">
        <div className="flex justify-between gap-4">
          <dt className="text-[#6e6e73]">Precio regular</dt>
          <dd>{formatPrice(p.basePriceCop)} COP</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#6e6e73]">Beneficio exclusivo asistentes RenaSER</dt>
          <dd className="text-[#2d4a7a]">-{formatPrice(p.discountAmountCop)} COP</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-[#e5e5ea] pt-2 font-semibold">
          <dt>Total a pagar</dt>
          <dd>{formatPrice(p.finalPriceCop)} COP</dd>
        </div>
      </dl>
    </div>
  );
};

export default RenaserInvitationPricingSummary;
