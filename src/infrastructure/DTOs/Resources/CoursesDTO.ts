export interface CoursesDTO {
	data: CoursesDatum[];
	meta: Meta;
}

export interface CoursesDatum {
	id:         number;
	attributes: DatumAttributes;
}

export interface DatumAttributes {
	Titulo:     string;
	Miniatura:  Miniatura;
	Encabezado: Encabezado;
}

export interface Encabezado {
	id:   number;
	Link: string;
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
