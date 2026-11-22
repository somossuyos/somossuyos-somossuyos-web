import {
  CAMINO_CIVIL_STATE_OPTIONS,
  CAMINO_DOCUMENT_TYPES,
  CAMINO_PASSPORT_VALID_OPTIONS,
  CAMINO_SEX_OPTIONS,
  type CaminoInscriptionClientPayload,
} from './inscriptionTypes';
import { computeAgeFromBirthDate, isAgeInAllowedRange } from './age';

export type CaminoValidationErrorCode =
  | 'invalid_payload'
  | 'spam_detected'
  | 'nombre_completo'
  | 'tipo_documento'
  | 'numero_documento'
  | 'fecha_nacimiento'
  | 'edad'
  | 'sexo'
  | 'nacionalidad'
  | 'ciudad_residencia'
  | 'pais_residencia'
  | 'profesion'
  | 'estado_civil'
  | 'correo'
  | 'telefono_movil'
  | 'telefono_alternativo'
  | 'pasaporte_vigente'
  | 'acepto_datos';

export type CaminoValidationResult =
  | { ok: true; data: CaminoInscriptionClientPayload; edad: number }
  | { ok: false; code: CaminoValidationErrorCode; message: string };

const NAME_RE = /^[a-zA-ZáéíóúñÑüÜ\s'.-]{3,120}$/;
const DOC_NUM_RE = /^[a-zA-Z0-9.-]{4,24}$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\+?[0-9\s]{8,18}$/;
const TEXT_RE = /^[a-zA-ZáéíóúñÑ0-9\s'.-]{2,80}$/;
const MIN_FORM_MS = 2500;

function trimStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function isOneOf<T extends string>(value: string, allowed: readonly T[]): value is T {
  return (allowed as readonly string[]).includes(value);
}

export function validateCaminoInscriptionPayload(
  raw: unknown,
  opts?: { minFormMs?: number; now?: number },
): CaminoValidationResult {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, code: 'invalid_payload', message: 'Solicitud invalida.' };
  }

  const body = raw as Record<string, unknown>;
  const website = trimStr(body.website);
  if (website.length > 0) {
    return { ok: false, code: 'spam_detected', message: 'No se pudo procesar el envio.' };
  }

  const started = typeof body.formStartedAt === 'number' ? body.formStartedAt : 0;
  const now = opts?.now ?? Date.now();
  const minMs = opts?.minFormMs ?? MIN_FORM_MS;
  if (started > 0 && now - started < minMs) {
    return { ok: false, code: 'spam_detected', message: 'Espera un momento antes de enviar.' };
  }

  const nombreCompleto = trimStr(body.nombreCompleto);
  if (!NAME_RE.test(nombreCompleto)) {
    return { ok: false, code: 'nombre_completo', message: 'Ingresa tu nombre completo (solo letras).' };
  }

  const tipoDocumento = trimStr(body.tipoDocumento);
  if (!isOneOf(tipoDocumento, CAMINO_DOCUMENT_TYPES)) {
    return { ok: false, code: 'tipo_documento', message: 'Selecciona un tipo de documento valido.' };
  }

  const numeroDocumento = trimStr(body.numeroDocumento);
  if (!DOC_NUM_RE.test(numeroDocumento)) {
    return { ok: false, code: 'numero_documento', message: 'Numero de documento invalido.' };
  }

  const fechaNacimiento = trimStr(body.fechaNacimiento);
  const edad = computeAgeFromBirthDate(fechaNacimiento);
  if (edad === null) {
    return { ok: false, code: 'fecha_nacimiento', message: 'Fecha de nacimiento invalida.' };
  }
  if (!isAgeInAllowedRange(edad)) {
    return {
      ok: false,
      code: 'edad',
      message: `La inscripcion aplica para personas de 18 a 45 anos (tu edad calculada: ${edad}).`,
    };
  }

  const sexo = trimStr(body.sexo);
  if (!isOneOf(sexo, CAMINO_SEX_OPTIONS)) {
    return { ok: false, code: 'sexo', message: 'Selecciona sexo.' };
  }

  const nacionalidad = trimStr(body.nacionalidad);
  if (!TEXT_RE.test(nacionalidad)) {
    return { ok: false, code: 'nacionalidad', message: 'Nacionalidad invalida.' };
  }

  const ciudadResidencia = trimStr(body.ciudadResidencia);
  if (!TEXT_RE.test(ciudadResidencia)) {
    return { ok: false, code: 'ciudad_residencia', message: 'Ciudad de residencia invalida.' };
  }

  const paisResidencia = trimStr(body.paisResidencia);
  if (!TEXT_RE.test(paisResidencia)) {
    return { ok: false, code: 'pais_residencia', message: 'Pais de residencia invalido.' };
  }

  const profesion = trimStr(body.profesion);
  if (!TEXT_RE.test(profesion)) {
    return { ok: false, code: 'profesion', message: 'Profesion u ocupacion invalida.' };
  }

  const estadoCivil = trimStr(body.estadoCivil);
  if (!isOneOf(estadoCivil, CAMINO_CIVIL_STATE_OPTIONS)) {
    return { ok: false, code: 'estado_civil', message: 'Selecciona estado civil.' };
  }

  const correo = trimStr(body.correo).toLowerCase();
  if (!EMAIL_RE.test(correo)) {
    return { ok: false, code: 'correo', message: 'Correo electronico invalido.' };
  }

  const telefonoMovil = trimStr(body.telefonoMovil).replace(/\s+/g, ' ');
  if (!PHONE_RE.test(telefonoMovil)) {
    return {
      ok: false,
      code: 'telefono_movil',
      message: 'Telefono movil invalido. Incluye indicativo (ej. +57 3001234567).',
    };
  }

  const telefonoAlternativoRaw = trimStr(body.telefonoAlternativo);
  let telefonoAlternativo: string | undefined;
  if (telefonoAlternativoRaw.length > 0) {
    if (!PHONE_RE.test(telefonoAlternativoRaw)) {
      return { ok: false, code: 'telefono_alternativo', message: 'Telefono alternativo invalido.' };
    }
    telefonoAlternativo = telefonoAlternativoRaw;
  }

  const pasaporteVigente = trimStr(body.pasaporteVigente);
  if (!isOneOf(pasaporteVigente, CAMINO_PASSPORT_VALID_OPTIONS)) {
    return { ok: false, code: 'pasaporte_vigente', message: 'Indica si tienes pasaporte vigente.' };
  }

  const aceptoDatos = body.aceptoDatos === true;
  if (!aceptoDatos) {
    return { ok: false, code: 'acepto_datos', message: 'Debes aceptar el tratamiento de datos personales.' };
  }

  const data: CaminoInscriptionClientPayload = {
    nombreCompleto,
    tipoDocumento: tipoDocumento,
    numeroDocumento,
    fechaNacimiento,
    sexo,
    nacionalidad,
    ciudadResidencia,
    paisResidencia,
    profesion,
    estadoCivil,
    correo,
    telefonoMovil,
    telefonoAlternativo,
    pasaporteVigente,
    aceptoDatos: true,
    formStartedAt: started,
  };

  return { ok: true, data, edad };
}