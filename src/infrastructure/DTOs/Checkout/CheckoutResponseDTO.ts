export interface CheckoutResponseDTO {
	transactionReference:      string;
	ammount:                   number;
	encodedIntegritySignature: string;
	/** URL de retorno acordada con el servidor (evita depender solo de env en el cliente). */
	redirectUrl?:              string | null;
}
