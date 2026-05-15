export interface CheckoutDTO {
	totalPrice: number;
	items: CheckoutItem[];
	form: CheckoutForm;
}

export interface CheckoutItem {
	quantity?: number;
	color?: string;
	size?: string;
	product?: string;
	course?: string;
	experience?: number;
	purpose?: string;
	asistants?: Omit<CheckoutForm, 'direction'>[];
	congressAsistants?: CongressAssistant[]
	client?: Omit<CheckoutForm, 'direction'>;
	book?: string
	type: string;
}

export interface CongressAssistant {
	names: string,
	age: string,
	email: string,
	phone: string,
	civilState: string
}

export interface CheckoutForm {
	names: string;
	lastNames?: string;
	email: string;
	phone: string;
	direction?: {
		city?: string;
		country: string;
		state?: string;
		direction?: string;
	};
}