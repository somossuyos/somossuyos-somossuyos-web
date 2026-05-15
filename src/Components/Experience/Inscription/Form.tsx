import React from 'react';
import { InscriptionFormData } from './InscriptionForm';

type FormProps = {
  formData: InscriptionFormData;
  // eslint-disable-next-line no-unused-vars
  handleChange: (name: string, value: string, id: number) => void;
  id: number;
}

const Form = ({ formData, id, handleChange }: FormProps) => {

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleChange(e.target.name, e.target.value, id);
  };

  return (
    <form
      className={`grid lg:grid-cols-2 gap-[12px] sm:gap-[25px] gap-y-4 w-full xl:min-w-[500px] ${id !== 0 ? 'mt-4' : ''}`}
      id={`inscription-form-${id}`}
    >
      <h2 className='sm:col-span-2'>
        {
          id === 0 ?
            'Datos del titular' :
            'Datos del acompañante # ' + id
        }
      </h2>
      <div className='flex flex-col w-full'>
        <label htmlFor="names" className='text-pale-skin text-[14px] mb-2'>Nombres</label>
        <input
          type="text"
          placeholder='Nombres'
          name='names'
          value={formData.names.value}
          className={`${formData.names.value.length === 0 || formData.names.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
          onChange={onChange}
        />
        <label htmlFor="lastNames" className='text-pale-skin text-[14px] mb-2'>Apellidos</label>
        <input
          type="text"
          placeholder='Apellidos'
          name='lastNames'
          value={formData.lastNames.value}
          onChange={onChange}
          className={`${formData.lastNames.value.length === 0 || formData.lastNames.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none sm:mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
        />
        <div className='flex flex-col'>
          <label htmlFor="sex" className='text-pale-skin text-[14px] mb-2'>Sexo</label>
          <select
            onChange={onChange}
            className='px-4 py-2 text-black rounded-[10px] border-2 border-transparent outline-none'
            name='sex'
            id='sex'
            value={formData.sex.value}
          >
            <option value='' hidden disabled>Seleccione</option>
            <option value='M'>Hombre</option>
            <option value='F'>Mujer</option>
          </select>
        </div>
      </div>
      <div className='flex flex-col'>
        <label htmlFor="email" className='text-pale-skin text-[14px] mb-2'>Correo electrónico</label>
        <input
          type="email"
          placeholder='Correo Electrónico'
          name='email'
          value={formData.email.value}
          onChange={onChange}
          className={`${formData.email.value.length === 0 || formData.email.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
        />
        <label htmlFor="phone" className='text-pale-skin text-[14px] mb-2'>Teléfono</label>
        <input
          type="tel"
          placeholder='Teléfono'
          name='phone'
          value={formData.phone.value}
          onChange={onChange}
          className={`${formData.phone.value.length === 0 || formData.phone.isValid ? 'border-transparent' : 'border-red-500'} border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
        />
      </div>
    </form>
  );
};

export default Form;