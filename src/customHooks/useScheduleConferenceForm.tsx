import { useState } from 'react';
import { FormFields } from '@/src/entities/FormFields';
import { conferenceRepository } from '@/src/infrastructure/repositories/conference.repository';
import { emptyConferenceForm } from '@/src/utils/emptyData';
import { validateField, validateInput } from '@/src/utils/formValidators';

export type ScheduleConferenceFormFields = {
  names: FormFields;
  lastNames: FormFields;
  email: FormFields;
  phone: FormFields;
  talk: boolean;
  event: boolean;
  group: boolean;
  virtual: boolean;
  dateDefined: boolean;
  date: string;
  organizerName: FormFields;
  organizerCountry: FormFields;
  organizerDirection: FormFields;
  message: FormFields;
};

export function useScheduleConferenceForm() {
  const [fields, setFields] = useState<ScheduleConferenceFormFields>(emptyConferenceForm);
  const [loading, setLoading] = useState<boolean>(false);
  const [sended, setSended] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === 'date') {
      setFields((prev) => ({ ...prev, date: value }));
      return;
    }
    if (name === 'dateDefined') {
      setFields((prev) => ({ ...prev, dateDefined: true }));
      return;
    }
    if (name === 'dateNotDefined') {
      setFields((prev) => ({ ...prev, dateDefined: false }));
      return;
    }
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFields({ ...fields, [name]: checkbox.checked });
      return;
    }
    const validInput = validateInput(name, value);
    if (!validInput) { return }
    const isValid = validateField(name, value);
    setFields({ ...fields, [name]: { value, isValid } });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    e.preventDefault();
    const date: string | Date | null = fields.date !== '' ? new Date(`${fields.date}T05:00`).toISOString() : null;
    const data = {
      'Nombres': fields.names.value,
      'Apellidos': fields.lastNames.value,
      'Correo': fields.email.value,
      'Telefono': fields.phone.value,
      'Charla_Parroquial': fields.talk,
      'Evento_Privado': fields.event,
      'Grupo_Apostolado': fields.group,
      'Virtual': fields.virtual,
      'Organizador': {
        'Nombre': fields.organizerName.value,
        'Pais': fields.organizerCountry.value,
        'Direccion': fields.organizerDirection.value
      },
      'Resumen': fields.message.value,
      'Fecha_Definida': fields.dateDefined,
      'Fecha': date
    };
    const response = await conferenceRepository.scheduleConference(data);
    setLoading(false);
    if (response.data) {
      setError(false);
      setSended(true);
    } else {
      setError(true);
    }
  };

  return {
    fields,
    setFields,
    loading,
    sended,
    error,
    handleChange,
    handleSubmit,
  };
}