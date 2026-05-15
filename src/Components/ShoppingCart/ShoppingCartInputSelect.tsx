import { validateInput } from '@/src/utils/formValidators';
import React, { useEffect, useRef, useState } from 'react';

type CheckoutInputSelectProps = {
  name: string;
  label: string;
  placeholder: string;
  options: string[];
  isValid?: boolean;
  containerClass?: string;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  onSelect: (value: string) => void;
}

const ShoppingCartInputSelect = ({ name, label, disabled, placeholder, isValid, options, onSelect }: CheckoutInputSelectProps) => {

  const [value, setValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(true);
  const optionsRef = useRef(options);

  useEffect(() => {
    if (optionsRef.current.length !== options.length) {
      optionsRef.current = options;
      setValue('');
      onSelect('');
    }
    if (options.length === 1 && value.length === 0) {
      setValue(options[0]);
      onSelect(options[0]);
      return;
    }
    setShowOptions(true);
    if (value.length === 0) {
      setFilteredOptions([]);
      return;
    }
    const findValue = options.find(option => option.toLowerCase() === value.toLowerCase());
    if (findValue === value) {
      setShowOptions(false);
      return;
    }
    setFilteredOptions(options.filter(option => option.toLowerCase().includes(value.toLowerCase())));
  }, [value, setFilteredOptions, options, onSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const isValid = validateInput(name, value);
    if (!isValid) {
      return;
    }
    setValue(value);
  };

  const handleSelect = (value: string) => {
    setValue(value);
    onSelect(value);
  };

  return (
    <div className='relative capitalize'>
      <label htmlFor={name} className='block mb-2'>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        id={name}
        disabled={disabled}
        className={`w-full p-2 border rounded-[4px] ${!isValid ? 'border-red-500' : ''} outline-none`}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete='off'
      />
      <div className='absolute z-10 bottom-0 left-0 w-full translate-y-[100%] max-h-[200px] overflow-y-auto capitalize border border-t-0'>
        {
          showOptions && filteredOptions.map((option, index) => (
            <div
              key={`option-${name}-${index}`} className='bg-white p-2 border border-gray-300 hover:bg-gray-100 hover:cursor-pointer'
              onClick={() => { handleSelect(option) }}
            >
              <p className='capitalize'>{option}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ShoppingCartInputSelect;