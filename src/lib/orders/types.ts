export type CheckoutOrderStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';

export type ProvisioningStatus = 'NOT_STARTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type CheckoutOrder = {
  reference: string;
  productId: string;
  productSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  amountInCents: number;
  currency: string;
  status: CheckoutOrderStatus;
  createdAt: string;
  updatedAt: string;
  wompiTransactionId?: string;
  provisioningStatus: ProvisioningStatus;
  provisioningError?: string;
};

export type CreatePendingCheckoutOrderInput = Omit<
  CheckoutOrder,
  'status' | 'createdAt' | 'updatedAt' | 'provisioningStatus'
> & {
  status?: CheckoutOrderStatus;
  provisioningStatus?: ProvisioningStatus;
};
