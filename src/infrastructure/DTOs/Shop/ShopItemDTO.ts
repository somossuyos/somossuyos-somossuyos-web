export interface ShopItemDTO {
	data: Data[];
	meta: Meta;
}

export interface Data {
	id:         number;
	attributes: PurpleAttributes;
}

export interface PurpleAttributes {
	Genero:              string;
	Titulo:              string;
	Precio:              number;
	Descripcion:         string;
	SKU:                 null;
	Stock:               number;
	categoria_productos: CategoriaProductos;
	Colores:             Colore[];
	Tallas:              Colore[];
	Fotos:               Fotos;
	Miniatura:           Miniatura;
	slug:				 string;
  Imagenes:            Miniatura;
}

export interface Colore {
	id:         number;
	Nombre:     string;
	codigo?:    null | string;
	Disponible: boolean;
}

export interface Fotos {
	data: DAT[];
}

export interface DAT {
	id:         number;
	attributes: FluffyAttributes;
}

export interface FluffyAttributes {
	url: string;
}

export interface Miniatura {
	data: DAT;
}

export interface CategoriaProductos {
	data: Datum[];
}

export interface Datum {
	id:         number;
	attributes: TentacledAttributes;
}

export interface TentacledAttributes {
	Nombre: string;
	Costo_envio?: number | string;
	slug: string
}

export interface Meta {
}