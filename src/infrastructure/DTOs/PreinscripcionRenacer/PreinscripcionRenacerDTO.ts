import { Meta, Pagination, EstadoCivil } from '../../../entities/types/SharedTypes';

// PreinscripcionRenacer type with API structure
export type PreinscripcionRenacerData = {
  id: number;
  attributes: {
    names: string;
    phone: string;
    email: string;
    age: string;
    maritalStatus: EstadoCivil;
    date: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
};

export interface PreinscripcionRenacerDTO {
  data: PreinscripcionRenacerData;
  meta: Meta;
}

export interface PreinscripcionRenacersDTO {
  data: PreinscripcionRenacerData[];
  meta: Meta;
}

export type { Meta, Pagination };