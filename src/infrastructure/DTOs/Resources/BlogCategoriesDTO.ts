export interface BlogCategoriesDTO {
	data: BlogCategoriesDatum[];
	meta: Meta;
}

export interface BlogCategoriesDatum {
	id:         number;
	attributes: Attributes;
}

export interface Attributes {
	Nombre: string;
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
