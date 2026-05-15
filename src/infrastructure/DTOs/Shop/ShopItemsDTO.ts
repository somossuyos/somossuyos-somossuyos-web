export interface ShopItemsDTO {
	data: ShopItemsDTODatum[];
	meta: Meta;
}

export interface ShopItemsDTODatum {
	id:         number;
	attributes: PurpleAttributes;
}

export interface PurpleAttributes {
	Titulo:              string;
	createdAt:           Date;
	categoria_productos: CategoriaProductos;
	Miniatura:           Miniatura;
	Precio:              number;
	slug:				 string
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
	height: number;
}

export interface CategoriaProductos {
	data: CategoriaProductosDatum[];
}

export interface CategoriaProductosDatum {
	id:         number;
	attributes: FluffyAttributes;
}

export interface FluffyAttributes {
	Nombre: string;
	Costo_envio?: number | string;
	slug: string
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
