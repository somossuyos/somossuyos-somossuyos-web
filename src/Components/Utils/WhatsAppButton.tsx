import React from 'react';
import WhatsAppSVG from '../SVG/WhatsAppSVG';

const WhatsAppButton = () => {
  return (
    <a
      className='flex items-center justify-center fixed bg-pale-skin bottom-5 md:bottom-10 right-5 md:right-10 hover:cursor-pointer w-10 2xl:w-16 aspect-square rounded-full z-[99]'
      target='_blank'
      href={'https://wa.me/573223885754?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20Somos%20Suyos.%20Gracias'}
    >
      <WhatsAppSVG
        className='w-6 2xl:w-10 aspect-square'
      />
    </a>
  );
};

export default WhatsAppButton;