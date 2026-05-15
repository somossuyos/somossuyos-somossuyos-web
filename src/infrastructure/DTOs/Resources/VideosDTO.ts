export interface VideosDTO {
	data: VideosDatum[];
	meta: Meta;
}

export interface VideosDatum {
	id:         number;
	attributes: DatumAttributes;
}

export interface DatumAttributes {
	Titulo:    string;
	Subtitulo: string;
	Link:      string;
	Miniatura: Miniatura;
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
