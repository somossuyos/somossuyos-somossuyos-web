import Image from 'next/image';
import { useState } from 'react';
import DonationsImage from '@/public/img/home/rayos donaciones.svg';
import { useRouter } from 'next/router';
import DonationsModal from './DonationsModal';

const DonationsLines = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return <>
    <div className={`flex flex-col sm:flex-row gap-5 sm:gap-[40px] px-4 sm:items-center justify-center mb-10 ${(router.pathname === '/' || router.pathname === '/nosotros') ? 'sm:mb-[150px]' : 'mt-24'} z-10`}>
      <p className='text-[26px] sm:text-[40px] font-stretch-pro'>
        Tus <span className='underline decoration-pale-skin underline-offset-[10px] font-stretch-pro relative w-fit'>
          <Image
            alt='Donaciones icon'
            src={DonationsImage}
            className='absolute left-1/2 top-0 -translate-y-6 sm:-translate-y-16 -translate-x-1/2 w-[100px] sm:w-[200px]'
          />
          donaciones
        </span> nos permiten mejorar
      </p>
      <button
        onClick={openModal}
        className='bg-pale-skin text-black text-[20px] px-[30px] py-[10px] rounded-[10px] font-futura font-bold w-fit'
      >
        DONAR
      </button>
    </div>
    {isModalOpen && (
      <DonationsModal closeModal={closeModal} />
    )}
  </>;
};

export default DonationsLines;