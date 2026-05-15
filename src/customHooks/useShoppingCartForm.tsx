import { CheckoutData } from '@/src/entities/CheckoutData';
import { validateField, validateInput } from '@/src/utils/formValidators';
import { Dispatch, SetStateAction, useState } from 'react';
import { countries } from '@/src/utils/countries';

// eslint-disable-next-line max-lines-per-function
export const useShoppingCartForm = (
  form: CheckoutData,
  setForm: Dispatch<SetStateAction<CheckoutData>>
) => {
  const [states, setStates] = useState<string[]>([]);
  const [currentCities, setCurrentCities] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const validField = validateInput(name, value);
    if (!validField) {
      return;
    }
    const isValid = validateField(name, value);
    setForm((prev) => {
      if (name === 'direction') {
        return {
          ...prev,
          direction: {
            ...prev.direction,
            [name]: {
              value,
              isValid,
            },
          },
        };
      }
      return {
        ...prev,
        [name]: {
          value,
          isValid,
        },
      };
    });
  };

  const setCountry = (value: string) => {
    if (!value) {
      setStates([]);
      setCurrentCities([]);
      return;
    }
    setStates(Object.keys(countries[value].states));
    setForm((prev) => {
      return {
        ...prev,
        direction: {
          ...prev.direction,
          country: {
            value,
            isValid: true
          },
          state: {
            value: '',
            isValid: false
          },
          city: {
            label: '',
            code: ''
          }
        },
      };
    });
  };

  const setDepartment = (value: string) => {
    if (!value) {
      setCurrentCities([]);
      return;
    }
    const selectedCountry = form.direction.country.value;
    setCurrentCities(countries[selectedCountry].states[value].cities);
    setForm((prev) => {
      return {
        ...prev,
        direction: {
          ...prev.direction,
          state: {
            value,
            isValid: true
          },
          city: {
            label: '',
            code: ''
          }
        },
      };
    });
  };

  const setCity = (value: string) => {
    setForm((prev) => {
      return {
        ...prev,
        direction: {
          ...prev.direction,
          city: {
            label: value,
            code: ''
          },
        },
      };
    });
  };

  return {
    handleChange,
    setCountry,
    setDepartment,
    setCity,
    countries: Object.keys(countries),
    states,
    currentCities
  };
};