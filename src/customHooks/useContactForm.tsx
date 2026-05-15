import { useState } from 'react';
import { FormFields } from '@/src/entities/FormFields';
import { contactRepository } from '@/src/infrastructure/repositories/contact.repository';
import { emptyContactForm } from '@/src/utils/emptyData';
import { validateField, validateInput } from '@/src/utils/formValidators';

export type ContactFormFields = {
  names: FormFields;
  lastNames: FormFields;
  email: FormFields;
  message: FormFields;
};

export const useContactForm = () => {
  const [formFields, setFormFields] = useState<ContactFormFields>(emptyContactForm);
  const [sended, setSended] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const validField = validateInput(name, value);
    if (!validField) { return }
    const isValid = validateField(name, value);
    setFormFields({ ...formFields, [name]: { value, isValid } });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name: formFields.names.value,
      lastName: formFields.lastNames.value,
      email: formFields.email.value,
      message: formFields.message.value
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
    handleSubmit
  };
};