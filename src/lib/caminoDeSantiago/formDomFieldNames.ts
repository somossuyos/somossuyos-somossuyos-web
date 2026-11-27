/**
 * Nombres DOM no estándar para que el autocompletar del navegador no mezcle
 * teléfonos/correos de otros formularios del sitio u otros usuarios del dispositivo.
 */
export const CAMINO_FORM_DOM_NAMES = {
  nombreCompleto: 'scs_cam_nombre_completo',
  tipoDocumento: 'scs_cam_tipo_documento',
  numeroDocumento: 'scs_cam_numero_documento',
  fechaNacimiento: 'scs_cam_fecha_nacimiento',
  sexo: 'scs_cam_sexo',
  nacionalidad: 'scs_cam_nacionalidad',
  ciudadResidencia: 'scs_cam_ciudad_residencia',
  paisResidencia: 'scs_cam_pais_residencia',
  profesion: 'scs_cam_profesion',
  estadoCivil: 'scs_cam_estado_civil',
  correo: 'scs_cam_correo',
  telefonoMovil: 'scs_cam_telefono_movil',
  telefonoAlternativo: 'scs_cam_telefono_alternativo',
  pasaporteVigente: 'scs_cam_pasaporte',
  aceptoDatos: 'scs_cam_acepto',
} as const;

export type CaminoFormFieldKey = keyof typeof CAMINO_FORM_DOM_NAMES;

const DOM_TO_STATE = Object.fromEntries(
  Object.entries(CAMINO_FORM_DOM_NAMES).map(([k, v]) => [v, k]),
) as Record<string, CaminoFormFieldKey>;

export function resolveCaminoFormFieldName(domName: string): CaminoFormFieldKey | null {
  const fromDom = DOM_TO_STATE[domName];
  if (fromDom) return fromDom;
  if (domName in CAMINO_FORM_DOM_NAMES) {
    return domName as CaminoFormFieldKey;
  }
  return null;
}

/** Evita relleno automático cruzado (Chrome/Safari/iOS). */
export const caminoSensitiveInputProps = {
  autoComplete: 'off' as const,
  'data-lpignore': 'true',
  'data-1p-ignore': true,
  'data-bwignore': 'true',
  'data-form-type': 'other',
};
