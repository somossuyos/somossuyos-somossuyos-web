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
    title: 'PAGO ÚNICO: 1.670 € (Con descuento incluido) Hasta el 30 de Enero de 2027)',
    amountEur: 1670,
  },
  {
    id: 'installments',
    title: 'Pago Diferido',
    amountEur: 531,
  },
];

export const CAMINO_CREDIT_CARD_SURCHARGE_RATE = 0.06;

export function getCaminoPlanById(id: string): CaminoPaymentPlan | undefined {
  return CAMINO_PAYMENT_PLANS.find((p) => p.id === id);
}
