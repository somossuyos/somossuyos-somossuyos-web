import { CongressInscriptionFormData } from '@/src/customHooks/useCongressForm';
import React from 'react';

type FormProps = {
  formData: CongressInscriptionFormData;
  // eslint-disable-next-line no-unused-vars
  handleChange: (name: string, value: string, id: number) => void;
  id: number;
}

// eslint-disable-next-line max-lines-per-function
const CongressInscriptionForm = ({ formData, id, handleChange }: FormProps) => {

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleChange(e.target.name, e.target.value, id);
  };

  return (
    <><form
      className={`grid lg:grid-cols-2 gap-[12px] sm:gap-[25px] gap-y-4 w-full xl:min-w-[500px] ${id !== 0 ? 'mt-4' : ''}`}
      id={`inscription-form-${id}`}
    >
      <h2 className='sm:col-span-2'>
        {id === 0 ?
          'Datos del titular' :
          'Datos del acompañante # ' + id}
      </h2>
      <div className='flex flex-col w-full'>
        <label htmlFor="names" className='text-pale-skin text-[14px] mb-2'>Nombres</label>
        <input
          type="text"
          placeholder='Nombres'
          name='names'
          id='names'
          value={formData.names.value}
          className={`${formData.names.value.length === 0 || formData.names.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
          onChange={onChange} />
        <label htmlFor="lastNames" className='text-pale-skin text-[14px] mb-2'>Apellidos</label>
        <input
          type="text"
          placeholder='Apellidos'
          name='lastNames'
          id='lastNames'
          value={formData.lastNames.value}
          className={`${formData.lastNames.value.length === 0 || formData.lastNames.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
          onChange={onChange} />
        <label htmlFor="age" className='text-pale-skin text-[14px] mb-2'>Edad</label>
        <input
          type="number"
          placeholder='Edad'
          name='age'
          id='age'
          value={formData.age.value}
          onChange={onChange}
          className={`${formData.age.value.length === 0 || formData.age.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none sm:mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`} />
      </div>
      <div className='flex flex-col'>
        <label htmlFor="email" className='text-pale-skin text-[14px] mb-2'>Correo electrónico</label>
        <input
          type="email"
          placeholder='Correo Electrónico'
          name='email'
          value={formData.email.value}
          onChange={onChange}
          className={`${formData.email.value.length === 0 || formData.email.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`} />
        <label htmlFor="phoneIndicative" className='text-pale-skin text-[14px] mb-2'>WhatsApp (Con indicativo)</label>
        <input
          type="tel"
          placeholder='57 31111111111'
          name='phoneIndicative'
          id='phoneIndicative'
          value={formData.phoneIndicative.value}
          onChange={onChange}
          className={`${formData.phoneIndicative.value.length === 0 || formData.phoneIndicative.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`} />
        <div className='flex flex-col'>
          <label htmlFor="civilState" className='text-pale-skin text-[14px] mb-2'>Estado civil</label>
          <select
            onChange={onChange}
            className='px-4 py-2 text-black rounded-[10px] border-2 border-transparent outline-none'
            name='civilState'
            id='civilState'
            value={formData.civilState.value}
          >
            <option value='' hidden disabled>Seleccione</option>
            <option value='soltero'>Soltero</option>
            <option value='casado'>Casado</option>
            <option value='divorciado'>Divorciado</option>
            <option value='unión libre'>Unión libre</option>
            <option value='consagrado'>Consagrado</option>
            <option value='sacerdote'>Sacerdote</option>
          </select>
        </div>
      </div>
    </form>
    </>
  );
};

export default CongressInscriptionForm;