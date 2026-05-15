export interface EventsDTO {
	data: EventsDatum[];
	meta: Meta;
}

export interface EventsDatum {
	id: number | string;
	attributes: DatumAttributes;
}

export interface DatumAttributes {
	Titulo: string;
	Ubicacion: string;
	Colaboracion: null | string;
	Dia: string;
	Fecha: Date;
	Tipo: string;
	Link: string;
	Miniatura: Miniatura;
	Duracion: string;
	Descripcion: string;
	Banner: Banner;
	Integrantes: string;
}

export interface Miniatura {
	data: Data;
}

export interface Banner {
	data: Data;
}

export interface Data {
	id: number;
	attributes: DataAttributes;
}

export interface DataAttributes {
	url: string;
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
