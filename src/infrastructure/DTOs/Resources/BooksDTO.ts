export interface BooksDTO {
	data: BooksDatum[];
	meta: Meta;
}

export interface BooksDatum {
	id: number;
	attributes: DatumAttributes;
}

export interface DatumAttributes {
	Nombre: string;
	Autor: string;
	Link: string;
	Miniatura: Miniatura;
	Precio:number;
	link_paypal?: string | null;
}

export interface Miniatura {
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
