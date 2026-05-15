import Image from 'next/image';
import React from 'react';

type PersonalProps = {
  name: string;
  lastName: string;
  image: string;
  role: string;
  description: string;
};

const Personal = ({
  name,
  lastName,
  image,
  role,
  description
}: PersonalProps) => {
  return (
    <div className='flex flex-col md:flex-row items-center justify-center gap-10 xl:gap-[30px] 2xl:gap-[40px] px-6 sm:px-[40px] xl:px-[100px] 2xl:px-[160px]'>
      <div className='flex items-center gap-4'>
        <Image
          src={image}
          width={160}
          height={160}
          alt={`Foto de ${name} ${lastName}`}
          className='max-w-[100px] sm:max-w-[160px] xl:max-w-[240px] max-h-[100px] sm:max-h-[160px] xl:max-h-[240px] min-w-[100px] sm:min-w-[160px] xl:min-w-[240px] min-h-[100px] sm:min-h-[160px] xl:min-h-[240px] w-full overflow-hidden'
        />
        <div className='w-fit'>
          <p className='font-stretch-pro text-[35px] sm:text-[60px] xl:text-[60px] 2xl:text-[80px] leading-none'>{name}</p>
          <p className='font-stretch-pro text-[20px] sm:text-[30px] 2xl:text-[40px] text-pale-skin sm:text-nowrap'>{lastName}</p>
          <p className='font-futura'>{role}</p>
        </div>
      </div>
      <p className='2xl:w-[700px] font-futura 2xl:text-[20px]'>{description}</p>
    </div>
  );
};

export default Personal;