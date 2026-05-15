export interface PaymentResponseDTO {
	transaction: Transaction;
}

export interface Transaction {
	redirectUrl:             null;
	amountInCents:           number;
	reference:               string;
	currency:                string;
	signature:               string;
	shippingAddress:         null;
	customerData:            CustomerData;
	customerEmail:           string;
	merchantUserId:          string;
	sessionId:               string;
	paymentMethodType:       string;
	customerNumberPrefix:    string;
	paymentMethod:           PaymentMethod;
	billingData:             BillingData;
	is_three_ds:             boolean;
	id:                      string;
	createdAt:               Date;
	finalizedAt:             Date;
	status:                  string;
	statusMessage:           null;
	paymentSourceId:         null;
	paymentLinkId:           null;
	billId:                  null;
	tipInCents:              null;
	merchant:                Merchant;
	canRetry:                boolean;
	signatureIntegrityRetry: null;
}

export interface BillingData {
	legalIdType: string;
	legalId:     string;
}

export interface CustomerData {
	fullName:    string;
	phoneNumber: string;
}

export interface Merchant {
	id:          number;
	name:        string;
	legalName:   string;
	contactName: string;
	phoneNumber: string;
	logoUrl:     null;
	legalIdType: string;
	email:       string;
	legalId:     string;
	publicKey:   string;
}

export interface PaymentMethod {
	type:         string;
	extra:        Extra;
	installments: number;
}

export interface Extra {
	name:                  string;
	brand:                 string;
	cardType:              string;
	lastFour:              string;
	isThreeDs:             boolean;
	threeDsAuth:           ExtraThreeDsAuth;
	externalIdentifier:    string;
	processorResponseCode: string;
}

export interface ExtraThreeDsAuth {
	threeDsAuth: ThreeDsAuthThreeDsAuth;
}

export interface ThreeDsAuthThreeDsAuth {
	currentStep:       string;
	currentStepStatus: string;
}
