import React, { useState } from 'react';
import Marquee from 'react-fast-marquee';
import Image from 'next/image';
import ChanelThumbnail from '@/public/img/home/Thumnail_video Youtube@2x.jpg';
import YouTubeIcon from '@/public/img/youtube.png';

const YouTubeChannel = () => {

  const [hasLoaded, setHasLoaded] = useState(false);

  return <>
    <Marquee className='bg-black py-5'>
      <p className='mx-2 font-futura text-[22px]'> “LA VERDAD SE CORROMPE TANTO CON LA MENTIRA COMO CON EL SILENCIO.”- <span className='bg-white text-black'>CICERÓN</span></p>
      <p className='mx-2 font-futura text-[22px]'> “LA VERDAD SE CORROMPE TANTO CON LA MENTIRA COMO CON EL SILENCIO.”- <span className='bg-white text-black'>CICERÓN</span></p>
    </Marquee>
    <div className='pt-5 relative z-10 bg-pale-skin w-full text-right h-[140px] sm:h-[220px] xl:h-[290px] 2xl:h-[360px] overflow-hidden pl-4 sm:pl-0'>
      <p className='text-border-black font-stretch-pro text-[160px] sm:text-[250px] xl:text-[350px] 2xl:text-[420px] leading-none text-pale-skin'>Canal</p>
    </div>
    <div className='flex flex-col z-10 sm:flex-row sm:gap-[60px] items-center sm:items-end justify-center px-8 w-full -mt-[30px] sm:-mt-[50px] 2xl:-mt-[120px] relative'>
      {
        !hasLoaded ?
          <>
            <Image
              src={ChanelThumbnail}
              alt='Chanel Thumbnail'
              className='h-fit w-[280px] sm:w-[320px] xl:w-[450px] 2xl:w-[680px] rounded-[15px] xl:rounded-[35px] aspect-video sm:ml-4 mb-6 sm:mb-0'
              onClick={() => setHasLoaded(true)}
            />
            <Image
              src={YouTubeIcon}
              alt='YouTube Icon'
              className='h-[50px] w-[50px] sm:h-[70px] sm:w-[70px] xl:h-[110px] xl:w-[110px] 2xl:h-[160px] 2xl:w-[160px] cursor-pointer absolute top-16 sm:top-4 xl:top-0 2xl:top-10 left-[50%] sm:left-[42%] xl:left-[38%] 2xl:left-[42%]'
              onClick={() => setHasLoaded(true)}
            />
          </>
          :
          <iframe
            width={680}
            height={380}
            src={'https://www.youtube.com/embed/gFKf0I0k4bk?autoplay=1'}
            className='h-[157px] sm:h-[180px] xl:h-[253px] 2xl:h-[382px] w-[280px] sm:w-[320px] xl:w-[450px] 2xl:w-[680px] rounded-[15px] 2xl:rounded-[35px] aspect-video sm:ml-4 mb-6 sm:mb-0'
            title={'Video presentación somos suyos'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
      }
      <p
        className='font-futura font-light mb-10 xl:text-[30px] leading-none self-center sm:self-auto sm:w-[40%] xl:w-[45%]'
      >En este <b className='font-bold'>espacio encontrarás respuestas</b> sobre el plan de Dios para tu vida, tu sexualidad y tu vocación al amor.</p>
    </div>
    <div className='flex justify-end items-center w-full pb-16'>
      <a
        href='https://www.youtube.com/@SomosSuyos'
        target='_blank'
        className='font-dark-twenty text-pale-skin text-[50px] sm:text-[70px] xl:text-[110px]'
      >Suscríbete</a>
      <div className='w-[45%] h-[2px] sm:h-[5px] bg-pale-skin mt-2 sm:mt-3 xl:mt-5 rounded-l-full'></div>
    </div>
  </>;
};

export default YouTubeChannel;