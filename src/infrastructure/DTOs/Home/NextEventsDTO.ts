export interface NextEventsDTO {
	data: Datum[];
	meta: Meta;
}

export interface Datum {
	id: number | string;
	attributes: Attributes;
}

export interface Attributes {
	Titulo: string;
	Ubicacion: string;
	Dia: string;
	Link: string;
	Fecha: Date;
}

export interface Meta {
	pagination: Pagination;
}

export interface Pagination {
	page: number;
	pageSize: number;
	pageCount: number;
	total: number;
}
