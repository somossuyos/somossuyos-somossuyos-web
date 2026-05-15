import React from 'react';
import Marquee from 'react-fast-marquee';
import DonationsLines from '../Utils/DonationsLines';

const WeAreDonations = () => {
  return (
    <div className='font-stretch-pro flex flex-col items-center justify-center relative'>
      <DonationsLines />
      <div className='w-full overflow-hidden sm:absolute bottom-0 left-0 order-2 sm:order-3 sm:translate-y-[280px]'>
        <Marquee className='pointer-events-none'>
          <p className='text-border text-black text-[150px] sm:text-[420px] font-stretch-pro'>Donaciones</p>
        </Marquee>
      </div>
    </div>
  );
};

export default WeAreDonations;