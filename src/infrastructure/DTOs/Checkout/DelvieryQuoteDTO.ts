export interface DeliveryQuoteDTO {
	idRate: number;
	idProduct: number;
	product: string;
	idCarrier: number;
	carrier: string;
	flete: number;
	minimumInsurance: number;
	extraInsurance: number;
	deliveryDays: number;
	distance: null;
	quotationType: string;
	cod: boolean;
	codDetails: null;
}
