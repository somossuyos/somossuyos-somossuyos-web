/* eslint-disable max-lines-per-function */
import { FormFields } from '@/src/entities/FormFields';
import LoadingSVG from '../SVG/LoadingSVG';
import { useScheduleConferenceForm } from '@/src/customHooks/useScheduleConferenceForm';

type ScheduleConferenceFormFields = {
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

const ScheduleConferenceForm = () => {
  const {
    fields,
    loading,
    sended,
    error,
    handleChange,
    handleSubmit,
  }= useScheduleConferenceForm();


  return (
    <form className='px-[20px] max-w-[500px] sm:max-w-max self-center lg:self-auto sm:px-[50px] xl:px-[100px] 2xl:px-[200px] grid grid-cols-1 lg:grid-cols-4 mt-[50px] sm:mt-[100px] gap-x-[45px]'>
      <div className='flex flex-col w-full'>
        <label htmlFor="names" className='text-pale-skin text-[14px] mb-2'>Nombres</label>
        <input
          type="text"
          placeholder='Nombres'
          name='names'
          value={fields.names.value}
          onChange={handleChange}
          id='names'
          className={`${fields.names.value.length === 0 || fields.names.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black w-full`}
        />
        <label htmlFor="lastNames" className='text-pale-skin text-[14px] mb-2'>Apellidos</label>
        <input
          type="text"
          placeholder='Apellidos'
          name='lastNames'
          onChange={handleChange}
          value={fields.lastNames.value}
          id='lastNames'
          className={`${fields.lastNames.value.length === 0 || fields.lastNames.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
        />
        <label htmlFor="email" className='text-pale-skin text-[14px] mb-2'>Correo electrónico</label>
        <input
          type="email"
          placeholder='Correo Electrónico'
          name='email'
          onChange={handleChange}
          value={fields.email.value}
          id='email'
          className={`${fields.email.value.length === 0 || fields.email.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
        />
        <label htmlFor="phone" className='text-pale-skin text-[14px] mb-2'>Número celular:</label>
        <input
          type="text"
          placeholder='Número celular:'
          name='phone'
          value={fields.phone.value}
          onChange={handleChange}
          id='phone'
          className={`${fields.phone.value.length === 0 || fields.phone.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
        />
      </div>
      <div className='flex flex-col lg:col-span-2'>
        <p className='text-pale-skin text-[14px] mb-2 ml-6'>Estas interesado en:</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 gap-y-[16px] w-full">
          <div className='flex items-center justify-center w-fit'>
            <input type="checkbox" name='talk' id='talk' onChange={handleChange} />
            <label htmlFor="talk" className='text-[14px] ml-2'>Charla Parroquial</label>
          </div>
          <div className='flex items-center justify-center w-fit'>
            <input type="checkbox" name='event' id='event' onChange={handleChange} />
            <label htmlFor="event" className='text-[14px] ml-2'>Evento Privado</label>
          </div>
          <div className='flex items-center justify-center w-fit'>
            <input type="checkbox" name='group' id='group' onChange={handleChange} />
            <label htmlFor="group" className='text-[14px] ml-2'>Grupo Apostolado </label>
          </div>
          <div className='flex items-center justify-center w-fit'>
            <input type="checkbox" name='virtual' id='virtual' onChange={handleChange} />
            <label htmlFor="virtual" className='text-[14px] ml-2'>Virtual</label>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 bg-white bg-opacity-10 px-6 py-4 rounded-[14px] gap-x-5 mt-4'>
          <div className='w-full'>
            <label htmlFor="organizer" className='text-pale-skin text-[14px] mb-2'>¿Quién organiza?</label>
            <p className='text-[12px] mb-2'>Ejemplo: Parroquia Cristo Rey</p>
            <input
              type="text"
              placeholder='Organizador'
              name='organizerName'
              onChange={handleChange}
              value={fields.organizerName.value}
              id='organizer'
              className={`${fields.organizerName.value.length === 0 || fields.organizerName.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black w-full`}
            />
          </div>
          <div className='w-full flex flex-col h-full justify-end'>
            <label htmlFor="country" className='text-pale-skin text-[14px] mb-2'>País para el evento</label>
            <input
              type="text"
              placeholder='País'
              name='organizerCountry'
              onChange={handleChange}
              value={fields.organizerCountry.value}
              id='country'
              className={`${fields.organizerCountry.value.length === 0 || fields.organizerCountry.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
            />
          </div>
          <div className='w-full flex flex-col h-full justify-end sm:col-span-2'>
            <label htmlFor="direction" className='text-pale-skin text-[14px] mb-2'>Dirección del lugar</label>
            <input
              type="text"
              placeholder='País'
              name='organizerDirection'
              onChange={handleChange}
              value={fields.organizerDirection.value}
              id='direction'
              className={`${fields.organizerDirection.value.length === 0 || fields.organizerDirection.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
            />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-10 mt-2'>
          <p className='text-pale-skin'>¿Tienes una fecha definida?</p>
          <div className='flex items-center justify-center w-fit'>
            <input type="checkbox" name='dateDefined' id='dateDefined' onChange={handleChange} checked={fields.dateDefined} />
            <label htmlFor="dateDefined" className='text-[14px] ml-2'>Sí</label>
          </div>
          <div className='flex items-center justify-center w-fit'>
            <input type="checkbox" name='dateNotDefined' id='dateNotDefined' onChange={handleChange} checked={!fields.dateDefined} />
            <label htmlFor="dateNotDefined" className='text-[14px] ml-2'>No</label>
          </div>
        </div>
        {
          fields.dateDefined && <div className='flex flex-col sm:flex-row gap-4 sm:gap-10 mt-2 items-center w-full'>
            <label htmlFor="date" className='text-pale-skin text-[14px]'>Fecha</label>
            <input
              type="date"
              placeholder='Fecha'
              name='date'
              onChange={handleChange}
              value={fields.date}
              id='date'
              className={'border-transparent border-2 outline-none px-3 py-2 text-[14px] rounded-[10px] text-black'}
            />
          </div>
        }
      </div>
      <div className='flex flex-col'>
        <label htmlFor="message" className='text-pale-skin text-[14px] mb-2'>Breve resumen del evento:</label>
        <textarea
          name="message"
          id="message"
          value={fields.message.value}
          onChange={handleChange}
          cols={30}
          rows={10}
          placeholder='Resumen'
          className={`${fields.message.value.length === 0 || fields.message.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black resize-none`}
        />
        <p className=''>{fields.message.value.length}/255</p>
        {
          !sended && <>
            <p className={`${Object.keys(fields).some((key) => {
              if (typeof fields[key as keyof ScheduleConferenceFormFields] === 'boolean' || key === 'date') {
                return false;
              }
              return (fields[key as keyof ScheduleConferenceFormFields] as FormFields).value.length === 0;
            }) ?
              'text-red-400' :
              'opacity-0'
            } text-[12px] my-2 text-right`}>Tienes que llenar todos los campos</p>
            <button
              className='w-fit text-black bg-pale-skin px-16 py-2 rounded-full mt-2 font-bold disabled:bg-opacity-50 disabled:cursor-not-allowed'
              disabled={!fields.names.isValid || !fields.lastNames.isValid || !fields.email.isValid ||
                !fields.message.isValid || !fields.organizerCountry || !fields.organizerDirection ||
                !fields.organizerName || !fields.phone.isValid || loading || sended}
              onClick={handleSubmit}
            >
              {
                loading ? <LoadingSVG /> : 'ENVIAR'
              }
            </button>
          </>
        }
        {
          sended && (
            <p className='text-green-500 text-[14px] mt-2'>Mensaje enviado correctamente</p>
          )
        }
        {
          error && (
            <p className='text-red-500 text-[14px] mt-2'>Error al enviar el mensaje, intentalo nuevamente</p>
          )
        }
      </div>
    </form>
  );
};

export default ScheduleConferenceForm;