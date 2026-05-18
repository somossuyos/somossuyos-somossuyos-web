export interface CheckoutResponseDTO {
	transactionReference:      string;
	ammount:                   number;
	encodedIntegritySignature: string;
	/** Clave pública Wompi (desde /api/wompi/create-order; evita `undefined` en el widget). */
	publicKey?:                string;
	/** URL de retorno acordada con el servidor (evita depender solo de env en el cliente). */
	redirectUrl?:              string | null;
}
