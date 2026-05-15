export interface ArticleDTO {
	data: ArticleDTOData[];
	meta: Meta;
}

export interface ArticleDTOData {
	id:         number;
	attributes: PurpleAttributes;
}

export interface PurpleAttributes {
	Titulo:   string;
	Tematica: Tematica;
	Seccion:  Seccion[];
	slug: string;
}

export interface Seccion {
	id:        number;
	Titulo:    string;
	Contenido: string;
	Media:     Media;
}

export interface Media {
	data: MediaData;
}

export interface MediaData {
	id:         number;
	attributes: FluffyAttributes;
}

export interface FluffyAttributes {
	url:    string;
	width:  number;
	height: number;
}

export interface Tematica {
	data: TematicaData;
}

export interface TematicaData {
	id:         number;
	attributes: TentacledAttributes;
}

export interface TentacledAttributes {
	Nombre: string;
}

export interface Meta {
}
