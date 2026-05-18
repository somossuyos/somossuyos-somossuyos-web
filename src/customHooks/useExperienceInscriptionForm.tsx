import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FormFields } from '@/src/entities/FormFields';
import { emptyInscriptionForm } from '@/src/utils/emptyData';
import { validateField, validateInput } from '@/src/utils/formValidators';
import { experiencesRepository } from '@/src/infrastructure/repositories/experience.repository';
import { checkoutRepository } from '@/src/infrastructure/repositories/checkout.repository';
import { CheckoutResponseDTO } from '@/src/infrastructure/DTOs/Checkout/CheckoutResponseDTO';
import { PaymentResponseDTO } from '@/src/infrastructure/DTOs/Checkout/PaymentResponseDTO';
import { getWompiRedirectUrlBrowser, resolveWompiPublicKeyForWidget } from '@/src/lib/wompi/clientEnv';

export type InscriptionFormData = {
  names: FormFields;
  lastNames: FormFields;
  email: FormFields;
  phone: FormFields;
  sex: FormFields;
};

// eslint-disable-next-line max-lines-per-function
export function useExperienceInscriptionForm({ experienceId, price, limit, terminos, category }: {
  experienceId: number;
  price: string;
  limit: string;
  terminos?: string;
  category: string;
}) {
  const [formFields, setFormFields] = useState<InscriptionFormData[]>([emptyInscriptionForm]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    setTotal(Number(price) * formFields.length);
  }, [formFields.length, price]);

  useEffect(() => {
    if (limit === 'F') {
      setText('Se han acabado los cupos de mujeres para esta experiencia. !Aún tenemos cupos para varones y esperamos verte en nuestro próximo encuentro!');
    } else {
      setText('Se han acabado los cupos de varones para esta experiencia. !Aún tenemos cupos para mujeres y esperamos verte en nuestro próximo encuentro!');
    }
  }, [limit]);

  const handleChange = (name: string, value: string, id: number) => {
    const validField = validateInput(name, value);
    if (!validField) { return }
    const isValid = validateField(name, value);
    setFormFields((prev) => prev.map((form, i) => i === id ? { ...form, [name]: { value, isValid } } : form));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formFields.some(form => form.sex.value === limit)) {
      setShowModal(true);
      return;
    }
    setLoading(true);
    if (category === 'no paga') {
      await registerInscription();
      return;
    }
    const data = {
      totalPrice: Number(total),
      items: [
        {
          type: 'pedido.experiencia',
          experience: experienceId,
          asistants: formFields.map(form => ({
            names: form.names.value,
            lastNames: form.lastNames.value,
            email: form.email.value,
            phone: form.phone.value,
          })),
        }
      ],
      form: {
        names: formFields[0].names.value,
        lastNames: formFields[0].lastNames.value,
        email: formFields[0].email.value,
        phone: formFields[0].phone.value,
        direction: { city: '', country: '', state: '', direction: '' },
      },
    };
    const response = await checkoutRepository.checkout(data) as CheckoutResponseDTO;
    const {
      ammount: amountInCents,
      transactionReference: reference,
      encodedIntegritySignature: integrity,
      redirectUrl,
      publicKey: serverPublicKey,
    } = response;
    const publicKey = resolveWompiPublicKeyForWidget(serverPublicKey);
    if (!publicKey) {
      throw new Error('missing_wompi_public_key');
    }
    const checkout = new window.WidgetCheckout({
      currency: 'COP',
      amountInCents,
      reference,
      publicKey,
      signature: { integrity },
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
  };

  const registerInscription = async () => {
    try {
      await Promise.all(formFields.map(async (form) => {
        const getInscription = await experiencesRepository.getInscriptionById(experienceId.toString(), form.email.value);
        if (getInscription.data.length > 0) {return null}
        const response = await experiencesRepository.registerExperience({
          id: experienceId.toString(),
          names: form.names.value,
          lastNames: form.lastNames.value,
          email: form.email.value,
          phone: form.phone.value,
        });
        if (!response.ok) {throw new Error('Hubo un error al registrar la inscripción, inténtalo de nuevo más tarde')}
        return response;
      }));
    } catch (error) {
      setText('Hubo un error al registrar la inscripción, inténtalo de nuevo más tarde');
    } finally {
      setCompleted(true);
    }
  };

  const addForm = () => setFormFields([...formFields, emptyInscriptionForm]);
  const removeForm = () => { if (formFields.length > 1) {setFormFields(formFields.slice(0, -1))} };
  const verifyValidForm = () => formFields.every(form => Object.values(form).every(field => field.isValid));

  return {
    formFields,
    setFormFields,
    loading,
    total,
    completed,
    showModal,
    setShowModal,
    text,
    handleChange,
    handleSubmit,
    addForm,
    removeForm,
    verifyValidForm,
    terminos,
    slug
  };
}