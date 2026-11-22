export const CAMINO_DOCUMENT_TYPES = ['CC', 'CE', 'Pasaporte', 'TI', 'Otro'] as const;
export const CAMINO_SEX_OPTIONS = ['Hombre', 'Mujer'] as const;
export const CAMINO_PASSPORT_VALID_OPTIONS = ['Si', 'No'] as const;
export const CAMINO_CIVIL_STATE_OPTIONS = [
  'Soltero',
  'Casado',
  'Divorciado',
  'Union libre',
  'Consagrado',
  'Sacerdote',
  'Viudo',
] as const;

export type CaminoDocumentType = (typeof CAMINO_DOCUMENT_TYPES)[number];
export type CaminoSex = (typeof CAMINO_SEX_OPTIONS)[number];
export type CaminoPassportValid = (typeof CAMINO_PASSPORT_VALID_OPTIONS)[number];
export type CaminoCivilState = (typeof CAMINO_CIVIL_STATE_OPTIONS)[number];

/** Payload enviado desde el cliente (sin datos sensibles en analytics). */
export type CaminoInscriptionClientPayload = {
  nombreCompleto: string;
  tipoDocumento: CaminoDocumentType;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexo: CaminoSex;
  nacionalidad: string;
  ciudadResidencia: string;
  paisResidencia: string;
  profesion: string;
  estadoCivil: CaminoCivilState;
  correo: string;
  telefonoMovil: string;
  telefonoAlternativo?: string;
  pasaporteVigente: CaminoPassportValid;
  aceptoDatos: boolean;
  /** Anti-spam: debe ir vacío */
  website?: string;
  /** ms desde que se montó el formulario */
  formStartedAt?: number;
};

export type CaminoInscriptionStrapiData = {
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string;
  edad: number;
  sexo: string;
  nacionalidad: string;
  ciudad_residencia: string;
  pais_residencia: string;
  profesion: string;
  estado_civil: string;
  correo: string;
  telefono_movil: string;
  telefono_alternativo: string | null;
  pasaporte_vigente: string;
  acepto_datos: boolean;
  fecha_inscripcion: string;
  fecha_aceptacion_politica: string;
  estado_inscripcion: string;
};