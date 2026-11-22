import LoadingSVG from '../SVG/LoadingSVG';
import { useCaminoInterestForm } from '@/src/customHooks/useCaminoInterestForm';

const CaminoInterestForm = () => {
  const { formFields, sended, error, loading, handleChange, handleSubmit } = useCaminoInterestForm();

  return (
    <form className="grid gap-4 w-full max-w-xl" id="registro">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="names" className="text-pale-skin text-[14px] mb-2">
            Nombres
          </label>
          <input
            type="text"
            placeholder="Nombres"
            name="names"
            value={formFields.names.value}
            className={`${formFields.names.value.length === 0 || formFields.names.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none px-3 py-2 text-[14px] rounded-[10px] text-black bg-white`}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="lastNames" className="text-pale-skin text-[14px] mb-2">
            Apellidos
          </label>
          <input
            type="text"
            placeholder="Apellidos"
            name="lastNames"
            value={formFields.lastNames.value}
            onChange={handleChange}
            className={`${formFields.lastNames.value.length === 0 || formFields.lastNames.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none px-3 py-2 text-[14px] rounded-[10px] text-black bg-white`}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="email" className="text-pale-skin text-[14px] mb-2">
          Correo electronico
        </label>
        <input
          type="email"
          placeholder="Correo electronico"
          name="email"
          value={formFields.email.value}
          onChange={handleChange}
          className={`${formFields.email.value.length === 0 || formFields.email.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none px-3 py-2 text-[14px] rounded-[10px] text-black bg-white`}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="message" className="text-pale-skin text-[14px] mb-2">
          Mensaje
        </label>
        <textarea
          name="message"
          id="message"
          rows={5}
          value={formFields.message.value}
          onChange={handleChange}
          className={`${formFields.message.value.length === 0 || formFields.message.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none px-3 py-2 text-[14px] rounded-[10px] text-black resize-none bg-white`}
        />
      </div>
      {!sended && !loading && (
        <>
          <p
            className={`${
              Object.keys(formFields).some(
                (key) => formFields[key as keyof typeof formFields].value.length === 0,
              )
                ? 'text-red-400'
                : 'opacity-0'
            } text-[12px]`}
          >
            Debes completar todos los campos
          </p>
          <button
            type="button"
            className="w-full sm:w-fit text-black bg-pale-skin px-12 py-3 rounded-full font-bold disabled:bg-opacity-50 disabled:cursor-not-allowed"
            disabled={
              !formFields.names.isValid ||
              !formFields.lastNames.isValid ||
              !formFields.email.isValid ||
              !formFields.message.isValid
            }
            onClick={handleSubmit}
          >
            ENVIAR SOLICITUD
          </button>
        </>
      )}
      {loading && (
        <button
          type="button"
          className="flex items-center justify-center w-full sm:w-fit text-black bg-pale-skin px-12 py-3 rounded-full font-bold"
          disabled
        >
          <LoadingSVG />
        </button>
      )}
      {sended && <p className="text-green-400 text-[14px]">Solicitud enviada. Pronto nos comunicaremos contigo.</p>}
      {error && (
        <p className="text-red-400 text-[14px]">
          No pudimos enviar el formulario. Intenta de nuevo o escribe a{' '}
          <a href="mailto:contacto@somossuyos.com" className="text-pale-skin underline">
            contacto@somossuyos.com
          </a>
          .
        </p>
      )}
    </form>
  );
};

export default CaminoInterestForm;