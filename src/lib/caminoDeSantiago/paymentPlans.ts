export type CaminoPaymentPlanId =
  | 'single'
  | 'installment-1'
  | 'installment-2'
  | 'installment-3'
  | 'installment-4';

export type CaminoPaymentPlan = {
  id: CaminoPaymentPlanId;
  title: string;
  amountEur: number;
  dueLabel: string;
  description: string;
};

/** Valores en EUR (comunicación oficial Camino). Cobro Wompi en COP (equivalente Somos Suyos). */
export const CAMINO_PAYMENT_PLANS: CaminoPaymentPlan[] = [
  {
    id: 'single',
    title: 'Pago único',
    amountEur: 1670,
    dueLabel: 'Un solo pago',
    description: 'Pago completo del viaje: 1.670 €',
  },
  {
    id: 'installment-1',
    title: 'Cuota 1 de 4',
    amountEur: 460,
    dueLabel: '30 de octubre de 2026',
    description: 'Primera cuota del plan en 4 pagos',
  },
  {
    id: 'installment-2',
    title: 'Cuota 2 de 4',
    amountEur: 459,
    dueLabel: '30 de noviembre de 2026',
    description: 'Segunda cuota del plan en 4 pagos',
  },
  {
    id: 'installment-3',
    title: 'Cuota 3 de 4',
    amountEur: 459,
    dueLabel: '30 de diciembre de 2026',
    description: 'Tercera cuota del plan en 4 pagos',
  },
  {
    id: 'installment-4',
    title: 'Cuota 4 de 4',
    amountEur: 459,
    dueLabel: '30 de enero de 2027',
    description: 'Cuarta cuota del plan en 4 pagos',
  },
];

export const CAMINO_CREDIT_CARD_SURCHARGE_RATE = 0.06;

export function getCaminoPlanById(id: string): CaminoPaymentPlan | undefined {
  return CAMINO_PAYMENT_PLANS.find((p) => p.id === id);
}