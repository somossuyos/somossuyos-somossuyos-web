import React from 'react';
import { addItem } from '@/src/redux/features/cartSlice';
import { useAppDispatch } from '@/src/redux/hooks';
import { useRouter } from 'next/router';

type DonationsModalProps = {
  purpose: string;
  toggleModal: ()=>void
};

const DonationModal = ({ purpose, toggleModal }: DonationsModalProps) => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);

  const router = useRouter();

  const dispatch = useAppDispatch();
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;
    const valueRegex = /^([0-9\s]){0,}$/;
    if (!valueRegex.test(value)) {
      return;
    }
    setValue(value);
    if (Number(value) < 3000) {
      setError(true);
      return;
    }
    setError(false);
  };

  const handleDonation = async () => {
    dispatch(
      addItem({
        id: 1,
        thumbnail: '/favicon.ico',
        title: `Donacion a ${purpose}`,
        type: 'donation',
        price: Number(value),
        quantity: 1,
        category: 'Donacion',
        purpose,
      })
    );
    toggleModal();
    router.push('/carrito');
  };

  return (
    <div className="w-full z-[9999] h-screen bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center" style={{zIndex: 9999}}>
      <div className="bg-white z-[9999] px-10 py-5 rounded-xl w-[90%] lg:w-[350px] xl:w-[400px] 2xl:w-[500px] flex flex-col gap-2" style={{zIndex: 99999}}>
        <p className="text-3xl text-gold font-bold">
          Tu donación es importante
        </p>
        <p className="text-black">
          Gracias por apoyar nuestro trabajo, tu contribución nos permite seguir
          anunciando a Jesús
        </p>
        <input
          type="text"
          placeholder="Monto"
          name="value"
          value={value}
          className={`${
            !error ? 'border-pale-skin' : 'border-red-500'
          } border-2 outline-none mb-4 px-3 py-2 text-[14px] rounded-[10px] text-black`}
          onChange={onChange}
        />
        <div className="flex items-center justify-center gap-4">
          <button
            className="bg-gold self-center text-black rounded-xl px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDonation}
            disabled={error || !value}
          >
            Donar
          </button>
          <button
            className="bg-custom-red self-center text-black rounded-xl px-4 py-2"
            onClick={toggleModal}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
