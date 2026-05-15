import React from 'react';
import ClassRoomIcon from '@/public/img/icons/acceso aula.svg';
import Image from 'next/image';

const MoodleButton = () => {
  return <a
    className='bg-pale-skin xl:bg-white text-black left-1/2 sm:left-4 -translate-x-1/2 sm:translate-x-0 whitespace-nowrap bottom-4 sm:bottom-[80px] absolute xl:static rounded-full min-w-[56px] xl:max-w-[56px] h-[56px] w-fit flex items-center justify-center z-50 gap-4 px-8 xl:px-0'
    href='https://aulavirtual.somossuyos.com'
    target='_blank'
    rel='noreferrer'
    title='Ir a la página de la aula virtual'
  >
    <Image
      src={ClassRoomIcon}
      alt='Icono de acceso aula'
      width={30}
      height={30}
      priority={true}
    />
    <p className='xl:hidden'>Ir a la aula virtual</p>
  </a>;
};

export default MoodleButton;