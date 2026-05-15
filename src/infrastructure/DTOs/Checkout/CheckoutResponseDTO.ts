export interface CheckoutResponseDTO {
	transactionReference:      string;
	ammount:                   number;
	encodedIntegritySignature: string;
}
