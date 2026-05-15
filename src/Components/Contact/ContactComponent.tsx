import React from 'react';
import Marquee from 'react-fast-marquee';
import ContactImage from '@/public/img/contacto/sjuanpablo_fondo.png';
import Image from 'next/image';
import ContactForm from './ContactForm';

const ContactComponent = () => {
  return (
    <div className='pt-[150px] sm:pt-[200px]'>
      <h2 className='ml-5 sm:ml-[100px] xl:ml-[200px] 2xl:ml-[250px] font-stretch-pro text-[25px] sm:text-[30px] xl:text-[50px] 2xl:text-[80px] leading-[20px] sm:leading-none 2xl:leading-[70px]  relative z-10'>Ahora <br />
        <span className='font-dark-twenty text-[37px] sm:text-[50px] xl:text-[80px] 2xl:text-[104px] text-pale-skin'>Contáctanos</span>
      </h2>
      <Marquee className='-mt-[130px] sm:-mt-[150px] lg:-mt-[200px] xl:-mt-[320px] relative z-0'>
        <p className='font-stretch-pro text-border text-[150px] sm:text-[200px] xl:text-[350px] 2xl:text-[400px]  h-[300px] sm:h-[350px] xl:h-[450px] 2xl:h-[500px] overflow-hidden text-black'>Contáctanos</p>
      </Marquee>
      <div className='flex items-center justify-center px-4 sm:pr-0 sm:pl-[10%] xl:pl-[200px] 2xl:pl-[300px] sm:mt-0'>
        <ContactForm />
        <Image
          src={ContactImage}
          alt='Contacto'
          className='w-[50%] max-w-[500px] h-[100%] object-cover hidden sm:block'
        />
      </div>
    </div>
  );
};

export default ContactComponent;