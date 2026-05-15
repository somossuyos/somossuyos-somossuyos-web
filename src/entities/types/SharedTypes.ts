

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  page:      number;
  pageSize:  number;
  pageCount: number;
  total:     number;
}


export interface ResponseData<T> {
  data: [{
    id: number;
    attributes: T;
  }]
  meta?: Meta;
}

// ===== Media =====
export type MediaData<T=unknown> = {
  data: {
    id: number;
    attributes: T
  };
}

export type MediaFormat = {
  ext?: string;
  url?: string;
  hash?: string;
  mime?: string;
  name?: string;
  path?: string | null;
  size?: number;
  width?: number;
  height?: number;
};

export type Formats = {
  [key: string]: MediaFormat;
};

export type Media = {
  url: string;
  name?: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: Formats;
  hash?: string;
  ext?: string;
  mime?: string;
  size?: number;
  previewUrl?: string;
  provider?: string;
  provider_metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;

  // legacy/compat fields
  Nombre?: string;
  Descripcion?: string;
};

// ===== ENTIDADES DE DOMINIO =====
export interface Encabezado {
  id: number;
  Titulos: Titulo[];
}

export interface Titulo {
  id: number;
  contenido: string;
}
// ===== ENUMERACIONES COMPARTIDAS =====

export type EstadoCivil = 'soltero' | 'casado' | 'divorciado' | 'unión libre' | 'consagrado' | 'sacerdote';

// Tematica se usa en Experience y Blog
export type Tematica = 'Para Solteros' | 'En el Noviazgo' | 'Para Matrimonios' | 'Ruptura amorosa';