import type { NextApiRequest, NextApiResponse } from 'next';
import { getRenaserAttendeePricing } from '@/src/lib/orders/renaserCheckout';
import { isBenefitSessionActive } from '@/src/lib/renaserBenefit/session';

type MeOk = {
  ok: true;
  benefitActive: true;
  pricing: ReturnType<typeof getRenaserAttendeePricing>;
};

type MeErr = { ok: false; benefitActive: false };

export default function handler(req: NextApiRequest, res: NextApiResponse<MeOk | MeErr>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, benefitActive: false });
  }

  if (!isBenefitSessionActive(req.headers.cookie)) {
    return res.status(401).json({ ok: false, benefitActive: false });
  }

  return res.status(200).json({
    ok: true,
    benefitActive: true,
    pricing: getRenaserAttendeePricing(),
  });
}
