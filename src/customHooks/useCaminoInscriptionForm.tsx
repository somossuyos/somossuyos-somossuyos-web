import { useMemo, useRef, useState } from 'react';
import { computeAgeFromBirthDate, isAgeInAllowedRange } from '@/src/lib/caminoDeSantiago/age';
import type { CaminoInscriptionClientPayload } from '@/src/lib/caminoDeSantiago/inscriptionTypes';
import { resolveCaminoFormFieldName } from '@/src/lib/caminoDeSantiago/formDomFieldNames';

export type CaminoFormState = {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  sexo: string;
  nacionalidad: string;
  ciudadResidencia: string;
  paisResidencia: string;
  profesion: string;
  estadoCivil: string;
  correo: string;
  telefonoMovil: string;
  telefonoAlternativo: string;
  pasaporteVigente: string;
  aceptoDatos: boolean;
};

const initialState: CaminoFormState = {
  nombreCompleto: '',
  tipoDocumento: '',
  numeroDocumento: '',
  fechaNacimiento: '',
  sexo: '',
  nacionalidad: 'Colombia',
  ciudadResidencia: '',
  paisResidencia: 'COLOMBIA',
  profesion: '',
  estadoCivil: '',
  correo: '',
  telefonoMovil: '',
  telefonoAlternativo: '',
  pasaporteVigente: '',
  aceptoDatos: false,
};

export const useCaminoInscriptionForm = () => {
  const formStartedAt = useRef(Date.now());
  const [fields, setFields] = useState<CaminoFormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const edad = useMemo(() => {
    if (!fields.fechaNacimiento) return null;
    return computeAgeFromBirthDate(fields.fechaNacimiento);
  }, [fields.fechaNacimiento]);

  const edadHint = useMemo(() => {
    if (edad === null) return '';
    if (!isAgeInAllowedRange(edad)) {
      return `Edad calculada: ${edad} anos. Solo 18 a 60 anos.`;
    }
    return `Edad calculada: ${edad} anos`;
  }, [edad]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const fieldKey = resolveCaminoFormFieldName(e.target.name);
    if (!fieldKey) return;
    const { value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFields((prev) => ({
      ...prev,
      [fieldKey]: type === 'checkbox' ? Boolean(checked) : value,
    }));
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || completed) return;
    setLoading(true);
    setErrorMessage('');

    const hp = (e.currentTarget.elements.namedItem('scs_cam_hp') as HTMLInputElement | null)?.value?.trim() ?? '';

    const payload: CaminoInscriptionClientPayload & { website: string; formStartedAt: number } = {
      ...fields,
      tipoDocumento: fields.tipoDocumento as CaminoInscriptionClientPayload['tipoDocumento'],
      sexo: fields.sexo as CaminoInscriptionClientPayload['sexo'],
      pasaporteVigente: fields.pasaporteVigente as CaminoInscriptionClientPayload['pasaporteVigente'],
      estadoCivil: fields.estadoCivil as CaminoInscriptionClientPayload['estadoCivil'],
      telefonoAlternativo: fields.telefonoAlternativo || undefined,
      aceptoDatos: fields.aceptoDatos,
      website: hp,
      formStartedAt: formStartedAt.current,
    };

    try {
      const res = await fetch('/api/camino-santiago/inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string; code?: string };
      if (!res.ok || !json.ok) {
        setErrorMessage(json.message || 'No pudimos enviar tu inscripcion.');
        return;
      }
      setCompleted(true);
    } catch {
      setErrorMessage('Error de conexion. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return {
    fields,
    edad,
    edadHint,
    loading,
    completed,
    errorMessage,
    handleChange,
    handleSubmit,
  };
};