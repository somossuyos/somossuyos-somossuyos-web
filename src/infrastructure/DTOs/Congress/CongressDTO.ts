export interface CongressDTO {
  data: Datum[];
  meta: Meta;
}

export interface Datum {
  id:         number;
  attributes: Attributes;
}

export interface Attributes {
  Telefono:     string;
  Correo:       string;
  createdAt:    Date;
  updatedAt:    Date;
  publishedAt:  Date;
  Nombres:      string;
  Edad:         string;
  Estado_civil: string;
  Fecha:        Date;
  Estado:       string;
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
