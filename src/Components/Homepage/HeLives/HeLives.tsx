import Image from 'next/image';
import React from 'react';
import JPImage from '@/public/img/home/SJuanPablo_@2x.png';
import JPImageBackground from '@/public/img/home/SJuanPablo_fondo.jpg';

const HeLives = () => {
  return (
    <div className='relative flex flex-col sm:flex-row w-full items-end font-futura pt-20'>
      <Image
        src={JPImage}
        alt='San Juan Pablo II'
        className='absolute top-[100px] -left-16 sm:static max-w-[60%] sm:max-w-[40%] z-10'
      />
      <div className='mb-[100px]'>
        <p className='sm:font-stretch-pro xl:text-[25px] 2xl:text-[32px] leading-1 xl:leading-[35px] 2xl:leading-[45px] mt-[25vw] sm:mt-0 ml-[40%] sm:ml-0 max-w-[50%] sm:max-w-[90%] relative z-10'>&quot;Solamente la libertad que se
          somete a la Verdad conduce <span className='bg-pale-skin px-2 sm:px-4 sm:font-stretch-pro text-black'>a la persona humana</span> a su
          verdadero bien. El bien de la
          persona consiste en estar
          en la Verdad y en realizar
          la Verdad&quot;.</p>
        <p className='text-pale-skin mt-[30px] text-[14px] sm:text-[18px] tracking-[5px] relative z-10 ml-[160px] sm:ml-0'>KAROL WOJTYLA</p>
      </div>
      <Image
        src={JPImageBackground}
        alt='San Juan Pablo II'
        className='absolute top-0 right-0 w-[200vw] max-w-[150vw] sm:max-w-full sm:w-full'
      />
    </div>
  );
};

export default HeLives;