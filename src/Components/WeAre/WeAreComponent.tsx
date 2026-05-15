import React from 'react';
import SLateral from '@/public/img/home/S_lateral@2x.png';
import BannerImagev from '@/public/img/nosotros/thmu_entrada_Blog.jpg';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import Personal from './Personal';
import { NosotrosProps } from '@/pages/nosotros';
import WeAreGallery from './WeAreGallery';
import WeAreDonations from './WeAreDonations';

type WeAreComponentProps = NosotrosProps;

const WeAreComponent = ({ staff, images }: WeAreComponentProps) => {
  return (
    <div className='relative min-h-screen pt-[150px] xl:pt-[250px]'>
      <Image src={SLateral} alt='Lateral Image' className='hidden lg:block absolute top-20 right-0 z-0 aspect-square pointer-events-none w-1/2 h-screen' />
      <div className='px-6 sm:pl-[40px] xl:pl-[100px] 2xl:pl-[160px] flex flex-col sm:flex-row xl:items-end sm:gap-[50px]'>
        <Image src={BannerImagev} alt='Banner Image' className='aspect-[425/650] w-[141px] sm:min-w-[250px] xl:w-[350px] 2xl:w-[425px] h-fit rounded-t-full' />
        <div className='xl:max-w-[58%] 2xl:max-w-[870px] font-futura sm:text-[20px] py-[50px] -mt-[120px] sm:mt-0'>
          <h2 className='font-stretch-pro text-[27px] sm:text-[54px] leading-none mb-[50px] sm:mb-10 ml-28 sm:-ml-10'>Nosotros <br />
            <span className='font-stretch-pro text-[35px] sm:text-[70px] text-pale-skin inline-block sm:-mt-16 sm:ml-6'>somos</span>
          </h2>
          <p><span className='bg-pale-skin px-1 text-black font-bold'>Una plataforma de formación</span> en teología del cuerpo, sexualidad y afectividad. Inició en redes sociales en año 2019. Abordando a la persona humana en su totalidad, busca dar respuesta a las preguntas y necesidades más profundas de jóvenes, adolescentes, adultos, matrimonios, sacerdotes y consagrados, con un énfasis interdisciplinario. Por medio de enseñanzas de filosofía, antropología, teología cristiana-católica, psicología y medicina reproductiva, se abordan las cuestiones más importantes de la persona humana y su identidad, el amor, la sexualidad, las relaciones interpersonales, la afectividad y la madurez emocional para reconocer plan de Dios para la persona humana y vivir así, la plenitud de la vocación al amor.</p>
        </div>
      </div>
      <h2 className='px-6 sm:ml-[50px] xl:ml-[150px] 2xl:ml-[250px] mt-10 sm:mt-[55px] xl:mt-[80px] 2xl:mt-[140px] font-stretch-pro text-[30px] sm:text-[50px] xl:text-[70px] 2xl:text-[80px] leading-none xl:leading-[70px] relative z-10'>Nuestro <br />
        <span className='font-dark-twenty text-[38px] sm:text-[50px] xl:text-[80px] 2xl:text-[104px] text-pale-skin'>Equipo</span>
      </h2>
      <Marquee className='-mt-16 sm:-mt-[175px]'>
        <p className='font-stretch-pro text-border text-[150px] sm:text-[200px] xl:text-[300px] 2xl:text-[400px] text-black'>Nuestro equipo</p>
      </Marquee>
      <div className='flex flex-col items-center justify-center mt-10 gap-10 sm:gap-[120px] mb-10 sm:mb-20 2xl:mb-[150px]'>
        {
          staff.map((staff, index) => (
            <Personal
              key={index}
              name={staff.name}
              lastName={staff.lastNames}
              image={staff.thumbnail}
              role={staff.shortDescription}
              description={staff.description}
            />
          ))
        }
      </div>
      <WeAreGallery images={images} />
      {/* <ImagePhrase /> */}
      <WeAreDonations />
    </div>
  );
};

export default WeAreComponent;