import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FormFields } from '@/src/entities/FormFields';
import { emptyCongressInscriptionForm } from '@/src/utils/emptyData';
import { validateField, validateInput } from '@/src/utils/formValidators';
import { checkoutRepository } from '@/src/infrastructure/repositories/checkout.repository';
import { CheckoutResponseDTO } from '@/src/infrastructure/DTOs/Checkout/CheckoutResponseDTO';
import { PaymentResponseDTO } from '@/src/infrastructure/DTOs/Checkout/PaymentResponseDTO';
import { getWompiRedirectUrlBrowser, resolveWompiPublicKeyForWidget } from '@/src/lib/wompi/clientEnv';

export type CongressInscriptionFormData = {
  names: FormFields;
  lastNames: FormFields;
  age: FormFields;
  email: FormFields;
  phoneIndicative: FormFields;
  civilState: FormFields;
}

// eslint-disable-next-line max-lines-per-function
export const useCongressForm = (price: string) => {
  const [formFields, setFormFields] = useState<CongressInscriptionFormData[]>([emptyCongressInscriptionForm]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [errorText, setErrorText] = useState('');
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let finalPrice = Number(price);
    if (formFields.length >= 3) {
      finalPrice = 410000;
    }
    const total = finalPrice * formFields.length;
    setTotal(total);
  }, [formFields.length, price]);

  const handleChange = (name: string, value: string, id: number) => {
    const validField = validateInput(name, value);
    if (!validField) { return }
    const isValid = validateField(name, value);
    setFormFields((prev) => {
      return prev.map((form, i) => {
        if (i === id) {
          return {
            ...form,
            [name]: {
              value,
              isValid,
            }
          };
        }
        return form;
      });
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setError(false);
    setLoading(true);

    const data = {
      totalPrice: Number(total),
      items: [
        {
          type: 'pedido.congreso',
          congressAsistants: formFields.map(form => ({
            names: `${form.names.value} ${form.lastNames.value}`,
            age: form.age.value,
            email: form.email.value,
            phone: form.phoneIndicative.value,
            civilState: form.civilState.value
          })),
        }
      ],
      form: {
        names: formFields[0].names.value,
        lastNames: formFields[0].lastNames.value,
        email: formFields[0].email.value,
        phone: formFields[0].phoneIndicative.value,
        direction: {
          city: '',
          country: '',
          state: '',
          direction: '',
        }
      },
    };

    try {
      const response = await checkoutRepository.checkout(data) as CheckoutResponseDTO | string;

      if (typeof response === 'string') {
        setErrorText(response);
        throw new Error();
      }

      const {
        ammount: amountInCents,
        transactionReference: reference,
        encodedIntegritySignature: integrity,
        redirectUrl,
        publicKey: serverPublicKey,
      } = response;

      const publicKey = resolveWompiPublicKeyForWidget(serverPublicKey);
      if (!publicKey) {
        setErrorText('No se pudo iniciar el pago: falta la clave pública de Wompi. Recarga la página o contacta soporte.');
        throw new Error('missing_wompi_public_key');
      }

      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents,
        reference,
        publicKey,
        signature: {
          integrity
        },
        redirectUrl: getWompiRedirectUrlBrowser(redirectUrl) || undefined,
        customerData: {
          email: data.form.email,
          fullName: `${data.form.names} ${data.form.lastNames}`,
          phoneNumber: data.form.phone,
          phoneNumberPrefix: '+57',
        }
      });

      checkout.open((response: PaymentResponseDTO) => {
        router.push(`/confirmacion-pago?id=${response.transaction.id}`);
      });
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  const addForm = () => {
    setFormFields([...formFields, emptyCongressInscriptionForm]);
  };

  const removeForm = () => {
    if (formFields.length === 1) { return }
    setFormFields(formFields.slice(0, -1));
  };

  const verifyValidForm = () => {
    return formFields.every(form => {
      return Object.values(form).every(field => field.isValid);
    });
  };

  return {
    formFields,
    loading,
    total,
    errorText,
    error,
    handleChange,
    handleSubmit,
    addForm,
    removeForm,
    verifyValidForm
  };
};