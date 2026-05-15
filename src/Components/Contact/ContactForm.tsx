import { useContactForm } from '@/src/customHooks/useContactForm';
import LoadingSVG from '../SVG/LoadingSVG';

const ContactForm = () => {
  const {
    formFields,
    sended,
    error,
    loading,
    handleChange,
    handleSubmit
  } = useContactForm();

  return (
    <form className='grid lg:grid-cols-2 gap-[12px] sm:gap-[50px] w-fit'>
      <div className='flex flex-col'>
        <label htmlFor="names" className='text-pale-skin text-[14px] mb-2'>Nombres</label>
        <input
          type="text"
          placeholder='Nombres'
          name='names'
          value={formFields.names.value}
          className={`${formFields.names.value.length === 0 || formFields.names.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
          onChange={handleChange}
        />
        <label htmlFor="lastNames" className='text-pale-skin text-[14px] mb-2'>Apellidos</label>
        <input
          type="text"
          placeholder='Apellidos'
          name='lastNames'
          value={formFields.lastNames.value}
          onChange={handleChange}
          className={`${formFields.lastNames.value.length === 0 || formFields.lastNames.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
        />
        <label htmlFor="email" className='text-pale-skin text-[14px] mb-2'>Correo electrónico</label>
        <input
          type="email"
          placeholder='Correo Electrónico'
          name='email'
          value={formFields.email.value}
          onChange={handleChange}
          className={`${formFields.email.value.length === 0 || formFields.email.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
        />
      </div>
      <div className='flex flex-col'>
        <label htmlFor="message" className='text-pale-skin text-[14px] mb-2'>Mensaje</label>
        <textarea
          name="message"
          id="message"
          cols={30}
          rows={6}
          value={formFields.message.value}
          onChange={handleChange}
          placeholder='Mensaje'
          className={`${formFields.message.value.length === 0 || formFields.message.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black resize-none`}
        />
        {
          !sended && !loading && <>
            <p className={`${Object.keys(formFields).some((key) => formFields[key as keyof typeof formFields].value.length === 0) ?
              'text-red-400' :
              'opacity-0'
            } text-[12px] my-2 text-right`}>Tienes que llenar todos los campos</p>
            <button
              className='w-fit text-black bg-pale-skin px-16 py-2 self-end rounded-full mt-2 font-bold disabled:bg-opacity-50 disabled:cursor-not-allowed'
              disabled={!formFields.names.isValid || !formFields.lastNames.isValid || !formFields.email.isValid || !formFields.message.isValid}
              onClick={handleSubmit}
            >ENVIAR</button>
          </>
        }
        {
          loading && (
            <button
              className='flex items-center justify-center w-full text-black bg-pale-skin px-16 py-2 self-end rounded-full mt-2 font-bold disabled:bg-opacity-50 disabled:cursor-not-allowed'
              disabled
            >
              <LoadingSVG />
            </button>
          )
        }
        {sended && <p className='text-green-500 text-[14px] mt-2'>Mensaje enviado correctamente</p>}
        {error && <p className='text-red-500 text-[14px] mt-2'>Error al enviar el mensaje, vuelve a intentarlo</p>}
      </div>
      <p className='lg:col-span-2'>O puedes escribirnos directamente a
        <a
          href='mailto:contacto@somossuyos.com'
          className='text-pale-skin ml-2'
        >contacto@somossuyos.com</a>
      </p>
    </form>
  );
};
export default ContactForm;