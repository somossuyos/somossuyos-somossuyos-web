export interface NextExperienceDTO {
	data: Datum[];
	meta: Meta;
}

export interface Datum {
	id: number;
	attributes: Attributes;
}

export interface Attributes {
	Fecha: Date;
	Tipo: string;
	Encabezado: Encabezado;
	slug:string
}

export interface Encabezado {
	id: number;
	Link: null;
	Titulos: Titulo[];
}

export interface Titulo {
	id: number;
	contenido: string;
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
