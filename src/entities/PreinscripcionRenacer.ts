import { EstadoCivil } from './types/SharedTypes';

// Pure PreinscripcionRenacer entity (application data structure)
export type PreinscripcionRenacer = {
  id: number;
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