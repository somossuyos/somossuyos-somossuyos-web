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
  /** SHA-256 of purchase invitation token (never store raw token). */
  invitationTokenHash?: string;
  invitationEmailNormalized?: string;
  baseAmountInCents?: number;
  discountPercent?: number;
  discountAmountInCents?: number;
};

export type CreatePendingCheckoutOrderInput = Omit<
  CheckoutOrder,
  'status' | 'createdAt' | 'updatedAt' | 'provisioningStatus'
> & {
  status?: CheckoutOrderStatus;
  provisioningStatus?: ProvisioningStatus;
};
