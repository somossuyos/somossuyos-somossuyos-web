export interface StaffsDTO {
	data: StaffsDTODatum[];
	meta: Meta;
}

export interface StaffsDTODatum {
	id:         number;
	attributes: PurpleAttributes;
}

export interface PurpleAttributes {
	Nombre:            string;
	Descripcion:       string;
	Descripcion_Corta: string;
	createdAt:         Date;
	updatedAt:         Date;
	publishedAt:       Date;
	Miniatura:         Miniatura;
}

export interface Miniatura {
	data: MiniaturaDatum[];
}

export interface MiniaturaDatum {
	id:         number;
	attributes: FluffyAttributes;
}

export interface FluffyAttributes {
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
