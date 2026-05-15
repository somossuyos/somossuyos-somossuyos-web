import { EstadoCivil } from '../../entities/types/SharedTypes';

// Empty data structure for PreinscripcionRenacer to avoid null values in React hooks
export const PreinscripcionRenacerEmptyData = {
  id: 0,
  attributes: {
    names: '',
    phone: '',
    email: '',
    age: '',
    maritalStatus: 'Soltero' as EstadoCivil,
    date: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
  },
};