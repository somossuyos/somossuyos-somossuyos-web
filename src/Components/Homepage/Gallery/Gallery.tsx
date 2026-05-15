import React, { useEffect, useState } from 'react';
import AnimatedTitle from './AnimatedTitle';
import GalleryImages from './GalleryImages';
import Image from 'next/image';
import LateralImage from '@/public/img/home/S_lateral@2x.png';

const Gallery = () => {

  const [isOnTop, setIsOnTop] = useState(false);
  const [isOnBottom, setIsOnBottom] = useState(false);
  const [magnitude, setMagnitude] = useState(0);

  useEffect(() => {
    const onScroll = () => {

      const galleryContainer = document.getElementById('gallery-container');
      if (galleryContainer) {
        setIsOnTop(
          galleryContainer.getBoundingClientRect().top < 0
        );
        setIsOnBottom(
          galleryContainer.getBoundingClientRect().bottom <= window.innerHeight
        );
      }

      const imageContainer = document.getElementById('image-ref');
      if (imageContainer && imageContainer.getBoundingClientRect()) {
        const magnitudeValue = - (imageContainer.getBoundingClientRect().top / window.innerHeight);
        if (magnitudeValue < 0) {
          setMagnitude(0);
          return;
        }
        if (magnitudeValue > 1) {
          setMagnitude(1);
          return;
        }
        setMagnitude(magnitudeValue);
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="w-full h-[250vh] sm:h-[400vh] relative bg-black"
      id='gallery-container'
    >
      <div id='image-ref' className='top-[60vh] sm:top-[120vh] left-0 w-0 h-0 z-0 absolute bg-transparent'></div>
      <div
        className='sm:text-[60px] text-white font-bold'
        style={{
          width: '100%',
          height: '100vh',
          position: (isOnTop && !isOnBottom) ? 'fixed' : 'absolute',
          transform: `translateY(${!isOnBottom ? 0 : '-100%'})`,
          top: isOnBottom ? '100%' : 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 0,
        }}
        id='gallery-title'
      >
        <Image src={LateralImage} alt='Lateral Image' className='absolute top-0 right-0 z-0 aspect-square pointer-events-none w-full xl:w-1/2 h-fit xl:h-full hidden sm:block' />
        <div className='h-1/2 sm:h-fukk' style={{
          opacity: 1 - magnitude,
        }}>
          <AnimatedTitle className='text-border text-black font-stretch-pro text-[20px] sm:text-[40px] xl:text-[50px] 2xl:text-[60px] leading-[30px] sm:leading-[50px] xl:leading-[65px] 2xl:leading-[80px]' title='Somos Suyos' />
          <AnimatedTitle className='text-pale-skin font-stretch-pro text-[10px] sm:text-[20px] xl:text-[30px] 2xl:text-[40px] leading-none' title='Es una plataforma de formación en' />
          <AnimatedTitle className='font-stretch-pro text-[16px] sm:text-[30px] xl:text-[50px] 2xl:text-[70px] leading-[22px] sm:leading-[38px] xl:leading-[65px] 2xl:leading-[90px]' title='Teología del cuerpo' />
          <AnimatedTitle className='font-stretch-pro text-[18px] sm:text-[32px] xl:text-[55px] 2xl:text-[80px] leading-none' title='Educación sexual' />
          <AnimatedTitle className='font-stretch-pro text-[20px] sm:text-[35px] xl:text-[60px] 2xl:text-[80px] leading-[25px] sm:leading-[42px] xl:leading-[70px] 2xl:leading-[100px] ' title='y afectividad.' isLast />
        </div>
        <GalleryImages magnitude={magnitude} />
      </div>
      <div className='absolute w-full h-[100px] bottom-0 left-0 bg-gradient-to-b from-transparent to-black'></div>
    </div>
  );
};

export default Gallery;