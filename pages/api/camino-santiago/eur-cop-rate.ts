import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getCaminoEurCopDisclaimer,
  getConfiguredEurToCopRate,
} from '@/src/lib/caminoDeSantiago/eurCopExchange';

type Ok = {
  ok: true;
  rate: number;
  fetchedAt: string;
  source: string;
  label?: string;
  disclaimer: string;
};

type Err = { ok: false; error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Ok | Err>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const snap = getConfiguredEurToCopRate();
  if (!snap) {
    return res.status(503).json({
      ok: false,
      error: 'Pago Camino no configurado. Contacta a Somos Suyos.',
    });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
  return res.status(200).json({
    ok: true,
    rate: snap.rate,
    fetchedAt: snap.fetchedAt,
    source: snap.source,
    label: snap.label,
    disclaimer: getCaminoEurCopDisclaimer(),
  });
}