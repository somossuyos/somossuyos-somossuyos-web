export type CaminoPaymentPlanId = 'single' | 'installments';

export type CaminoPaymentPlan = {
  id: CaminoPaymentPlanId;
  title: string;
  amountEur: number;
};

/** Solo dos opciones de cobro. El detalle de cuotas es texto del documento. */
export const CAMINO_PAYMENT_PLANS: CaminoPaymentPlan[] = [
  {
    id: 'single',
    title: 'Un único pago: 1.670 € (Hasta el 20 de diciembre)',
    amountEur: 1670,
  },
  {
    id: 'installments',
    title: 'Pago a cuotas',
    amountEur: 505,
  },
];

export const CAMINO_CREDIT_CARD_SURCHARGE_RATE = 0.06;

export function getCaminoPlanById(id: string): CaminoPaymentPlan | undefined {
  return CAMINO_PAYMENT_PLANS.find((p) => p.id === id);
}
