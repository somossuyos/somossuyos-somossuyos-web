export type RenaserInvitationStatus =
  | 'AVAILABLE'
  | 'CHECKOUT_STARTED'
  | 'PURCHASED'
  | 'DISABLED';

export type RenaserInvitationEmailStatus = 'PENDING' | 'SENT' | 'FAILED';

/** DynamoDB PK = emailNormalized (one invitation identity per normalized email). */
export type RenaserPurchaseInvitation = {
  tokenHash: string;
  emailNormalized: string;
  firstName: string;
  lastName: string;
  status: RenaserInvitationStatus;
  createdAt: string;
  expiresAt?: string;
  usedAt?: string;
  orderReference?: string;
  wompiTransactionId?: string;
  reservationExpiresAt?: string;
  emailStatus?: RenaserInvitationEmailStatus;
  emailAttempts?: number;
  emailSentAt?: string;
  sesMessageId?: string;
  bounceOrComplaintAt?: string;
};

export type CreateRenaserInvitationInput = {
  tokenHash: string;
  emailNormalized: string;
  firstName: string;
  lastName: string;
  expiresAt?: string;
};

export type InvitationPublicView = {
  ok: true;
  firstName: string;
  lastName: string;
  emailMasked: string;
  status: RenaserInvitationStatus;
  alreadyPurchased: boolean;
};

export type InvitationErrorView = {
  ok: false;
  message: string;
};
