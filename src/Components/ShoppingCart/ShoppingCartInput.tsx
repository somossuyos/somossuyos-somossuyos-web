import React from 'react';

type CheckoutInputProps = {
  name: string;
  label: string;
  value: string;
  placeholder: string;
  containerClass?: string;
  isValid: boolean;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ShoppingCartInput = ({
  name,
  label,
  value,
  placeholder,
  containerClass,
  disabled,
  isValid,
  onChange
}: CheckoutInputProps) => {
  return (
    <div className={containerClass ?? ''}>
      <label htmlFor={name} className='block mb-2'>{label}</label>
      <input
        type="text"
        name={name}
        id={name}
        value={value}
        disabled={disabled}
        className={`w-full p-2 border rounded-[4px] outline-none ${isValid ? 'border-gray-300' : 'border-red-500'}`}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete='off'
      />
    </div>
  );
};

export default ShoppingCartInput;