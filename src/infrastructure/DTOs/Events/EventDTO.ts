export interface EventDTO {
	data: EventDTOData;
	meta: Meta;
}

export interface EventDTOData {
	id:         number;
	attributes: PurpleAttributes;
}

export interface PurpleAttributes {
	Titulo:         string;
	Ubicacion:      string;
	Dia:            string;
	Colaboracion:   null;
	Tipo:           string;
	createdAt:      Date;
	updatedAt:      Date;
	publishedAt:    Date;
	Fecha:          Date;
	Disponibilidad: boolean;
	Descripcion:    string;
	Integrantes:    string;
	Duracion:       string;
	Miniatura:      Banner;
	Banner:         Banner;
}

export interface Banner {
	data: BannerData;
}

export interface BannerData {
	id:         number;
	attributes: FluffyAttributes;
}

export interface FluffyAttributes {
	url: string;
}

export interface Meta {
}
