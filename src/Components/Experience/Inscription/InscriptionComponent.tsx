import Marquee from 'react-fast-marquee';
import ContactImage from '@/public/img/contacto/sjuanpablo_fondo.png';
import Image from 'next/image';
import InscriptionForm from './InscriptionForm';
import CongressInscriptionForm from '@/src/Components/Congress/Inscription/CongressInscriptionForm';
import { useCongressForm } from '@/src/customHooks/useCongressForm';

type InscriptionComponentProps = {
  price: string;
  limit: string;
  isCongress?: boolean;
  experienceId: number;
  terminos?: string;
  category: string;
};


type CongressInscriptionSectionProps = {
  congressForm: ReturnType<typeof useCongressForm>;
  terminos?: string;
};
const CongressInscriptionSection = ({ congressForm, terminos }: CongressInscriptionSectionProps) => {
  const {
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
  } = congressForm;
  return (
    <div className='pt-[150px] sm:pt-[200px] w-full overflow-hidden'>
      <h2 className='ml-5 sm:ml-[100px] xl:ml-[200px] 2xl:ml-[250px] font-stretch-pro text-[25px] sm:text-[30px] xl:text-[50px] 2xl:text-[80px] leading-[20px] sm:leading-none 2xl:leading-[70px] relative z-10'>Ahora <br />
        <span className='font-dark-twenty text-[37px] sm:text-[50px] xl:text-[80px] 2xl:text-[104px] text-pale-skin'>Inscríbete</span>
      </h2>
      <Marquee className='-mt-[130px] sm:-mt-[150px] lg:-mt-[200px] xl:-mt-[320px] relative z-0'>
        <p className='font-stretch-pro text-border text-[150px] sm:text-[200px] xl:text-[350px] 2xl:text-[400px] text-black'>Inscríbete</p>
      </Marquee>
      <div className='flex items-center justify-center px-8 sm:pl-[10%] xl:pl-[200px] 2xl:pl-[300px] sm:mt-0'>
        <div className='flex gap-4 flex-col lg:flex-row w-full sm:w-fit'>
          <div className='w-full sm:w-fit'>
            {formFields.map((form, i) => (
              <CongressInscriptionForm
                key={`form-${i}`}
                id={i}
                formData={form}
                handleChange={handleChange}
              />
            ))}
            {error && (
              <p className='text-red-500 text-sm'>{errorText}</p>
            )}
          </div>
          <div className='flex flex-col items-end'>
            <p className='text-xl text-right font-stretch-pro'>
              Valor a pagar: <br />
              <b>{total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</b>
            </p>
            <div className='px-[18px] py-2 rounded-full flex gap-6 border border-[#D7D7D7] h-fit w-fit my-4'>
              <button className='text-[#A1A1A1]' onClick={removeForm}>-</button>
              <p>{formFields.length}</p>
              <button className='text-[#A1A1A1]' onClick={addForm}>+</button>
            </div>
            <button
              className='w-fit text-black bg-pale-skin px-16 py-2 self-end rounded-full mt-2 font-bold disabled:bg-opacity-50 disabled:cursor-not-allowed'
              onClick={handleSubmit}
              disabled={!verifyValidForm() || loading}
            >
              {loading ? 'Procesando...' : 'INSCRIBIRSE'}
            </button>
            {formFields.length > 0 && terminos && terminos.trim() !== '' && (
              <p className="text-xs text-gray-500 mt-2">
                Al inscribirte aceptas los{' '}
                <a
                  href={`/eventos/${typeof window !== 'undefined' && window.location ? window.location.pathname.split('/')[2] : ''}/terminos`}
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
        <Image
          src={ContactImage}
          alt='Contacto'
          className='w-[50%] max-w-[500px] h-[100%] object-cover hidden sm:block'
        />
      </div>
    </div>
  );
};

type ExperienceInscriptionSectionProps = {
  price: string;
  limit: string;
  experienceId: number;
  terminos?: string;
  category: string;
};
const ExperienceInscriptionSection = ({ price, limit, experienceId, terminos, category }: ExperienceInscriptionSectionProps) => (
  <div className='pt-[150px] sm:pt-[200px] w-full overflow-hidden'>
    <h2 className='ml-5 sm:ml-[100px] xl:ml-[200px] 2xl:ml-[250px] font-stretch-pro text-[25px] sm:text-[30px] xl:text-[50px] 2xl:text-[80px] leading-[20px] sm:leading-none 2xl:leading-[70px] relative z-10'>Ahora <br />
      <span className='font-dark-twenty text-[37px] sm:text-[50px] xl:text-[80px] 2xl:text-[104px] text-pale-skin'>Inscríbete</span>
    </h2>
    <Marquee className='-mt-[130px] sm:-mt-[150px] lg:-mt-[200px] xl:-mt-[320px] relative z-0'>
      <p className='font-stretch-pro text-border text-[150px] sm:text-[200px] xl:text-[350px] 2xl:text-[400px] text-black'>Inscríbete</p>
    </Marquee>
    <div className='flex items-center justify-center px-8 sm:pl-[10%] xl:pl-[200px] 2xl:pl-[300px] sm:mt-0'>
      <InscriptionForm price={price} limit={limit} experienceId={experienceId} terminos={terminos} category={category} />
      <Image
        src={ContactImage}
        alt='Contacto'
        className='w-[50%] max-w-[500px] h-[100%] object-cover hidden sm:block'
      />
    </div>
  </div>
);

const InscriptionComponent = ({ price, limit, isCongress = false, experienceId, terminos, category }: InscriptionComponentProps) => {
  const congressForm = useCongressForm(price);
  if (isCongress) {
    return <CongressInscriptionSection congressForm={congressForm} terminos={terminos} />;
  }
  return <ExperienceInscriptionSection price={price} limit={limit} experienceId={experienceId} terminos={terminos} category={category} />;
};

export default InscriptionComponent;