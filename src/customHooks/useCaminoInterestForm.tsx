import { useState } from 'react';
import { FormFields } from '@/src/entities/FormFields';
import { contactRepository } from '@/src/infrastructure/repositories/contact.repository';
import { validateField, validateInput } from '@/src/utils/formValidators';
import { caminoDeSantiagoContent } from '@/src/lib/caminoDeSantiago/content';

export type CaminoInterestFormFields = {
  names: FormFields;
  lastNames: FormFields;
  email: FormFields;
  message: FormFields;
};

const initialMessage = caminoDeSantiagoContent.interest.defaultMessage;

const initialFields: CaminoInterestFormFields = {
  names: { value: '', isValid: false },
  lastNames: { value: '', isValid: false },
  email: { value: '', isValid: false },
  message: { value: initialMessage, isValid: true },
};

export const useCaminoInterestForm = () => {
  const [formFields, setFormFields] = useState<CaminoInterestFormFields>(initialFields);
  const [sended, setSended] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const validField = validateInput(name, value);
    if (!validField) {
      return;
    }
    const isValid = validateField(name, value);
    setFormFields({ ...formFields, [name]: { value, isValid } });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const prefixedMessage = `[Camino de Santiago — solicitud de información]\n\n${formFields.message.value}`;
    const data = {
      name: formFields.names.value,
      lastName: formFields.lastNames.value,
      email: formFields.email.value,
      message: prefixedMessage,
    };

    const response = await contactRepository.sendContactForm(data);
    setLoading(false);
    if (response.data) {
      setSended(true);
    } else {
      setError(true);
    }
  };

  return {
    formFields,
    sended,
    error,
    loading,
    handleChange,
    handleSubmit,
  };
};