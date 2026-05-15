export interface GetCheckoutDTO {
	data: GetCheckoutDatum[];
	meta: Meta;
}

export interface GetCheckoutDatum {
	id:         number;
	attributes: Attributes;
}

export interface Attributes {
	Estado: string;
}

export interface Meta {
	pagination: Pagination;
}

export interface Pagination {
	page:      number;
	pageSize:  number;
	pageCount: number;
	total:     number;
}
