import type { CheckoutOrder, CheckoutOrderStatus } from './types';

/** Operaciones mínimas usadas por webhook / confirmación / reintentos. */
export type CheckoutOrdersStore = {
  getCheckoutOrderByReference(reference: string): Promise<CheckoutOrder | null>;
  updateCheckoutOrderStatus(
    reference: string,
    status: CheckoutOrderStatus,
    wompiTransactionId?: string,
  ): Promise<void>;
  tryMarkProvisioningProcessing(reference: string): Promise<boolean>;
  markProvisioningCompleted(reference: string): Promise<void>;
  markProvisioningFailed(reference: string, error: string): Promise<void>;
};
