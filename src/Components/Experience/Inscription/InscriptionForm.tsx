import { FormFields } from '@/src/entities/FormFields';
import LoadingSVG from '../../SVG/LoadingSVG';
import { formatPrice } from '@/src/utils/formatPrice';
import Form from './Form';
import CompletedMessage from './CompletedMessage';
import { useExperienceInscriptionForm } from '@/src/customHooks/useExperienceInscriptionForm';

export type InscriptionFormData = {
  names: FormFields;
  lastNames: FormFields;
  email: FormFields;
  phone: FormFields;
  sex: FormFields;
}

type InscriptionFormProps = {
  experienceId:number
  price: string;
  limit: string;
  terminos?: string;
  category: string;
}

// eslint-disable-next-line max-lines-per-function
const InscriptionForm = (props: InscriptionFormProps) => {
  const { terminos } = props;
  const {
    formFields,
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
    slug
  }
   = useExperienceInscriptionForm(props);

  if (completed) { return <CompletedMessage /> }

  return (
    <div className='flex gap-4 flex-col lg:flex-row w-full sm:w-fit'>
      {
        showModal && <div className='w-full h-screen bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center'>
          <div className='bg-white px-10 py-5 rounded-xl w-[90%] lg:w-[350px] xl:w-[400px] 2xl:w-[500px] flex flex-col gap-2'>
            <p className='text-3xl text-custom-red font-bold'>Lo sentimos</p>
            <p className='text-black'>{text}</p>
            <button
              className='bg-custom-red self-center text-black rounded-xl px-4 py-2'
              onClick={() => setShowModal(false)}
            >Cerrar</button>
          </div>
        </div>
      }
      <div className='w-full sm:w-fit'>
        {
          formFields.map((form, i) => (
            <Form
              key={`form-${i}`}
              id={i}
              formData={form}
              handleChange={handleChange}
            />
          ))
        }
        {
          completed && <>
            <p className='text-xl text-right font-stretch-pro'>
              Inscripción registrada
            </p>
            <a>
            </a>
          </>
        }
      </div>
      <div className='flex flex-col items-end'>
        {
          Number(props.price) !== 0 && props.category === 'paga' &&
          <p className='text-xl text-right font-stretch-pro'>
            Valor a pagar: <br />
            <b>{formatPrice(Number(total))}</b>
          </p>
        }
        <div className='px-[18px] py-2 rounded-full flex gap-6 border border-[#D7D7D7] h-fit w-fit my-4'>
          <button className='text-[#A1A1A1]' onClick={removeForm}>-</button>
          <p>{formFields.length}</p>
          <button className='text-[#A1A1A1]' onClick={addForm}>+</button>
        </div>
        {
          formFields.map((form, i) => (
            <p key={`form-${i}`} className='text-red-500 text-sm'>
              {
                Object.values(form).some(field => !field.isValid) ?
                  `Debes llenar todos los datos del ${i === 0 ? 'titular' : 'acompañante'} ${i > 0 ? i : ''}` :
                  ''
              }
            </p>
          ))
        }
        <button
          className='w-fit text-black bg-pale-skin px-16 py-2 self-end rounded-full mt-2 font-bold disabled:bg-opacity-50 disabled:cursor-not-allowed'
          onClick={handleSubmit}
          disabled={!verifyValidForm() || loading}
        >
          {
            loading ?
              <LoadingSVG /> :
              'INSCRIBIRSE'
          }
        </button>

        {slug && terminos && terminos.trim() !== '' && (
          <p className="text-xs text-gray-500 mt-2">
            Al inscribirte aceptas los{' '}
            <a
              href={`/eventos/${slug}/terminos`}
              className="underline text-gold hover:text-gold/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              términos y condiciones
            </a>
            {' '}de esta experiencia.
          </p>
        )}
      </div>
    </div>
  );
};

export default InscriptionForm;