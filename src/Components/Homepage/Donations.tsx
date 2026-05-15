import React from 'react';
import Marquee from 'react-fast-marquee';
import DonationsLines from '../Utils/DonationsLines';


const Donations = () => {
  return (
    <div className='font-stretch-pro flex flex-col items-center justify-center mt-16'>
      <Marquee className='pointer-events-none -mt-6 sm:-mt-[160px]'>
        <p className='text-border text-black text-[150px] sm:text-[420px] font-stretch-pro'>Donaciones</p>
      </Marquee>
      <DonationsLines />
    </div>
  );
};

export default Donations;
