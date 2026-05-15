
import { Book } from './Book';
import {
  Media,
  MediaData,
  ResponseData,
  Tematica,
  Encabezado
} from './types/SharedTypes';

export type ExperienceResponse = ResponseData<Experience>
export type ExperiencesResponse = ResponseData<Experience>

export interface Experience {
  id:                       number
  Fecha:                    Date | string;
  fecha_maxima_inscripcion: Date | string;
  vendido:                  boolean;
  Hora:                     string;
  habilitar_inscripcion:    boolean;
  Precio:                   number;
  max_inscritos:            number;
  deshabilitar_por_sexo:    string;
  Titulo:                   string;
  Descripcion:              string;
  Tematica:                 Tematica;
  Tipo:                     string;
  Estado:                   string;
  habilitar_donaciones:     boolean;
  adicionales:              string;
  terminos:                 string;
  categoria:                string;
  link:                     string;
  slug:                     string;
  expositores:              Expositores[];
  Miniatura:                MediaData<Media>;
  Encabezado:               Encabezado;
  Actividad:                Actividad;
  Mosaico:                  MediaData<Media>;
  recurso_libro?:           MediaData<Book>;

}
export interface Expositores {
  id:              number;
  nombres:         string;
  afiliacion:      string;
  descripcion:     string;
  foto:            MediaData<Media>;
  foto_afiliacion: MediaData<Media>;
}

export interface Actividad {
  id:             number;
  Titulo:         string;
  Cantidad:       number;
  Duracion:       string;
  Subactividades: Subactividade[];
}

export interface Subactividade {
  id:     number;
  Nombre: null | string;
}

export type ExperienceStatus = 'Finalizado' | 'Activo';
export type ExperienceCategory = 'congreso' | 'paga' | 'no paga' | 'no inscripción';
export type ExperienceType = 'Presencial' | 'Online';
export type ExperienceGender = 'No' | 'Femenino' | 'Masculino';
