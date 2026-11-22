import type { CaminoInscriptionClientPayload, CaminoInscriptionStrapiData } from './inscriptionTypes';

const STRAPI_COLLECTION = 'camino-santiago-inscripciones';

export type StrapiSubmitResult =
  | { ok: true; id?: number }
  | { ok: false; reason: 'not_configured' | 'strapi_error' | 'collection_missing'; status?: number };

function mapToStrapi(data: CaminoInscriptionClientPayload, edad: number): CaminoInscriptionStrapiData {
  return {
    nombre_completo: data.nombreCompleto,
    tipo_documento: data.tipoDocumento,
    numero_documento: data.numeroDocumento,
    fecha_nacimiento: data.fechaNacimiento,
    edad,
    sexo: data.sexo,
    nacionalidad: data.nacionalidad,
    ciudad_residencia: data.ciudadResidencia,
    pais_residencia: data.paisResidencia,
    profesion: data.profesion,
    estado_civil: data.estadoCivil,
    correo: data.correo,
    telefono_movil: data.telefonoMovil,
    telefono_alternativo: data.telefonoAlternativo?.trim() || null,
    pasaporte_vigente: data.pasaporteVigente,
    acepto_datos: true,
    fecha_inscripcion: new Date().toISOString(),
  };
}

export async function submitCaminoInscriptionToStrapi(
  data: CaminoInscriptionClientPayload,
  edad: number,
): Promise<StrapiSubmitResult> {
  const apiUrl = process.env.API_URL?.replace(/\/$/, '');
  const token = process.env.STRAPI_CAMINO_API_TOKEN?.trim();

  if (!apiUrl || !token) {
    return { ok: false, reason: 'not_configured' };
  }

  const url = `${apiUrl}/${STRAPI_COLLECTION}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: mapToStrapi(data, edad) }),
  });

  if (response.status === 404) {
    return { ok: false, reason: 'collection_missing', status: 404 };
  }

  if (!response.ok) {
    return { ok: false, reason: 'strapi_error', status: response.status };
  }

  try {
    const json = (await response.json()) as { data?: { id?: number } };
    return { ok: true, id: json.data?.id };
  } catch {
    return { ok: true };
  }
}