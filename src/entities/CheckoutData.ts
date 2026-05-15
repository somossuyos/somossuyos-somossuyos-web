import { FormFields } from './FormFields';

export type CheckoutData = {
	names: FormFields;
	lastNames: FormFields;
	email: FormFields;
	phone: FormFields;
	direction: DirectionData;
};

export type DirectionData = {
	country: FormFields;
	city: DirectionField;
	state: FormFields;
	direction: FormFields;
};

export type DirectionField = {
	label: string;
	code: string;
}