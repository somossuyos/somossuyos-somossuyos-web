/* eslint-disable no-unused-vars */
import { CheckoutData } from '@/src/entities/CheckoutData';
import { Dispatch, SetStateAction } from 'react';
import ShoppingCartInput from './ShoppingCartInput';
import { useShoppingCartForm } from '@/src/customHooks/useShoppingCartForm';
import useShoppingCart, {
  isCartDigitalOnly,
} from '@/src/customHooks/useShoppingCart';

type CheckoutFormProps = {
  form: CheckoutData;
  setForm: Dispatch<SetStateAction<CheckoutData>>;
};


type ShoppingCartPersonalFieldsProps = {
  form: CheckoutData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};
const ShoppingCartPersonalFields = ({ form, handleChange }: ShoppingCartPersonalFieldsProps) => (
  <>
    <ShoppingCartInput
      name="names"
      label="Nombre"
      value={form.names.value}
      placeholder="Nombre"
      isValid={form.names.value.length === 0 || form.names.isValid}
      onChange={handleChange}
    />
    <ShoppingCartInput
      name="lastNames"
      label="Apellido"
      value={form.lastNames.value}
      placeholder="Apellido"
      isValid={form.lastNames.value.length === 0 || form.lastNames.isValid}
      onChange={handleChange}
    />
    <ShoppingCartInput
      name="email"
      label="Correo electrónico"
      value={form.email.value}
      placeholder="Correo electrónico"
      isValid={form.email.value.length === 0 || form.email.isValid}
      onChange={handleChange}
    />
    <ShoppingCartInput
      name="phone"
      label="Número de teléfono"
      value={form.phone.value}
      placeholder="Número de teléfono"
      isValid={form.phone.value.length === 0 || form.phone.isValid}
      onChange={handleChange}
    />
  </>
);

type ShoppingCartDeliverySectionProps = {
  form: CheckoutData;
  setCountry: (country: string) => void;
  setDepartment: (department: string) => void;
  setCity: (city: string) => void;
  countries: string[];
  states: string[];
  currentCities: string[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};
const ShoppingCartDeliverySection = ({ form, setCountry, setDepartment, setCity, countries, states, currentCities, handleChange }: ShoppingCartDeliverySectionProps) => (
  <>
    <p className="sm:col-span-2 text-[18px]">Entrega</p>
    <select
      name="country"
      id="country"
      onChange={(e) => {
        setCountry(e.target.value);
      }}
      value={form.direction.country.value}
      className="w-full p-2 border border-gray-300 rounded-[4px] outline-none"
    >
      <option value={''}>Selecciona un país</option>
      {countries.map((country) => (
        <option value={country} key={`opt-${country}`}>
          {country}
        </option>
      ))}
    </select>
    <select
      name="state"
      id="department"
      onChange={(e) => {
        setDepartment(e.target.value);
      }}
      value={form.direction.state.value}
      className={`w-full p-2 border border-gray-300 rounded-[4px] outline-none ${!form.direction.country.value ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''}`}
      disabled={!form.direction.country.value}
    >
      <option value={''}>Selecciona un departamento</option>
      {states.map((state) => (
        <option value={state} key={`opt-${state}`}>
          {state}
        </option>
      ))}
    </select>
    <select
      name="city"
      id="city"
      onChange={(e) => {
        setCity(e.target.value);
      }}
      value={form.direction.city.label}
      className={`w-full p-2 border border-gray-300 rounded-[4px] outline-none ${!form.direction.state.value ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''}`}
      disabled={!form.direction.state.value}
    >
      <option value={''}>Selecciona una ciudad</option>
      {currentCities.map((city) => (
        <option value={city} key={`opt-${city}`}>
          {city}
        </option>
      ))}
    </select>
    <div className="sm:col-span-2">
      <label htmlFor="direction" className="block mb-2">
        Dirección
      </label>
      <textarea
        name="direction"
        id="direction"
        value={form.direction.direction.value}
        onChange={handleChange}
        cols={20}
        rows={2}
        placeholder="Dirección"
        className={`w-full p-2 border border-gray-300 rounded-[4px] resize-none outline-none ${form.direction.direction.value.length === 0 || form.direction.direction.isValid ? 'border-gray-300' : 'border-red-500'}`}
        required
      />
    </div>
  </>
);

const ShoppingCartForm = ({ form, setForm }: CheckoutFormProps) => {
  const { items } = useShoppingCart();
  const {
    handleChange,
    setCountry,
    setDepartment,
    setCity,
    countries,
    states,
    currentCities,
  } = useShoppingCartForm(form, setForm);
  const isDigital = isCartDigitalOnly(items);
  return (
    <form className="w-full sm:w-[80%] lg:w-[500px] xl:w-[700px]">
      <h2 className="font-bold m-2">Detalles de comprador</h2>
      <div className="w-full h-2 bg-pale-skin mt-4 mb-10"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 p-2 gap-x-4 gap-y-6">
        <ShoppingCartPersonalFields form={form} handleChange={handleChange} />
        {!isDigital && (
          <ShoppingCartDeliverySection
            form={form}
            setCountry={setCountry}
            setDepartment={setDepartment}
            setCity={setCity}
            countries={countries}
            states={states}
            currentCities={currentCities}
            handleChange={handleChange}
          />
        )}
      </div>
    </form>
  );
};

export default ShoppingCartForm;
