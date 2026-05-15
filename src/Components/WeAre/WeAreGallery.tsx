import Image from 'next/image';
import React, { useState } from 'react';

type WeAreGalleryProps = {
  images: string[];
};

const WeAreGallery = ({ images }: WeAreGalleryProps) => {

  const [watchMore, setWatchMore] = useState(false);

  return <>
    <h2 className='px-6 sm:ml-[50px] xl:ml-[150px] 2xl:ml-[250px] mt-10 font-stretch-pro text-[30px] sm:text-[50px] xl:text-[70px] 2xl:text-[80px] leading-none xl:leading-[70px] relative z-10'>Siempre <br />
      <span className='font-dark-twenty text-[38px] sm:text-[50px] xl:text-[80px] 2xl:text-[104px] text-pale-skin'>Presentes</span>
    </h2>
    <div className={`px-4 sm:px-[50px] xl:px-[150px] 2xl:px-[250px] mt-10 sm:mt-[120px] xl:mt-[100px] 2xl:mt-[140px] mb-5 grid sm:grid-cols-3 xl:grid-cols-4 gap-5 ${watchMore ? 'h-auto' : 'h-screen sm:h-[500px] xl:h-[600px] 2xl:h-[800px] overflow-hidden'} relative`}>
      {
        images.map((image, index) => (
          <Image
            key={`we-are-gallery-image-${index}`}
            src={image}
            alt={`Imagen de la galeria ${index}`}
            className='w-full h-auto aspect-square object-cover relative z-0'
            width={500}
            height={500}
          />
        ))
      }
      <div className={`absolute bottom-0 left-0 px-6 sm:px-[50px] xl:px-[150px] 2xl:px-[250px] flex items-center justify-center w-full h-[100px] ${watchMore ? 'translate-y-[100%]': 'bg-gradient-to-b from-transparent to-black'}  z-10`}>
        <button
          className='bg-pale-skin text-black text-[20px] px-[30px] py-[10px] rounded-[10px] font-futura font-bold w-fit'
          onClick={() => setWatchMore(!watchMore)}
        >
          Ver {watchMore ? 'menos' : 'más'}
        </button>
      </div>
    </div>
  </>;
};

export default WeAreGallery;