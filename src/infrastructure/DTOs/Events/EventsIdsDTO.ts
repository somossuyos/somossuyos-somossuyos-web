export interface EventsIDSDTO {
	data: EventsIDSDatum[];
	meta: Meta;
}

export interface EventsIDSDatum {
	id:         number;
	attributes: Attributes;
}

export interface Attributes {
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
