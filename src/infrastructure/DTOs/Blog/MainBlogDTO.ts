export interface MainBlogDTO {
	data: MainBlogDatum[];
	meta: Meta;
}

export interface MainBlogDatum {
	id:         number;
	attributes: DatumAttributes;
}

export interface DatumAttributes {
	Titulo:    string;
	Fecha:     Date;
	Miniatura: Miniatura;
	slug: string;
}

export interface Miniatura {
	data: Data;
}

export interface Data {
	id:         number;
	attributes: DataAttributes;
}

export interface DataAttributes {
	url: string;
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
