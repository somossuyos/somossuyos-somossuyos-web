import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export type NextExperienceProps = {
  id:number
  slug: string
  month: string
  type: string
  header: { firstPart: string, secondPart: string }
}

const NextExperience = ({ id, slug, month, type, header }: NextExperienceProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
  const [isInBottom, setIsInBottom] = useState(false);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;

      const videoContainer = document.getElementById('main-video-container');
      if (videoContainer && videoContainer.getBoundingClientRect().bottom < window.innerHeight) {
        setIsInBottom(true);
      } else {
        setIsInBottom(false);
      }

      const newScale = (scroll / window.innerHeight);
      setScale(newScale > 1 ? 1 : newScale);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (Number(id) === 0) { return null }

  return (
    <div
      className='flex flex-col sm:flex-row gap-[30px] xl:gap-[60px] mt-[60px] sm:items-center justify-end sm:static w-full'
      style={{
        position: (isMobile && !isInBottom) ? 'fixed' : 'static',
        top: `calc(50vh + ${scale * 50}vh)`
      }}
    >
      <p className='font-stretch-pro text-[25px] sm:text-[30px] xl:text-[35px] 2xl:text-[40px] leading-none w-fit ml-10 sm:ml-0'>
        <span className='font-dark-twenty inline-block text-[36px] sm:text-[40px] xl:text-[50px] 2xl:text-[60px] text-pale-skin'>Vive una</span><br />
        experiencia <br />
        <span className='font-dark-twenty text-right inline-block w-full text-[36px] sm:text-[40px] xl:text-[50px] 2xl:text-[60px] text-pale-skin'>{type}</span>
      </p>
      <div className='hidden sm:block w-[1px] h-[90px] bg-pale-skin'></div>
      <>
        <div className='font-futura h-full bg-[#585858] sm:bg-transparent px-10 sm:px-0 py-6 sm:py-0 mt-8 sm:mt-0'>
          <p className='leading-none sm:leading-[30px]'>
            <span className='px-2 py-1 border sm:border-0 border-pale-skin rounded-full'>EN {month}</span> <br />
            <span className='text-[33px] sm:text-[30px] xl:text-[45px] 2xl:text-[50px] font-stretch-pro'>
              {header.firstPart}
            </span>
            {header.secondPart && (
              <span className='font-dark-twenty text-pale-skin text-[60px] sm:text-[40px] xl:text-[85px] 2xl:text-[100px] inline-block'>
                {header.secondPart}
              </span>
            )}
          </p>
        </div>
        <Link
          className='xl:text-[30px] font-stretch-pro py-2 xl:py-4 bg-pale-skin w-fit rounded-l-full text-black pl-5 xl:pl-10 pr-[50px] xl:pr-[200px] 2xl:pr-[400px] self-end sm:self-auto -translate-y-1/2 sm:transform-none block'
          href={`/eventos/${slug}`}
        >
          Ver más
        </Link>
      </>
    </div>
  );
};

export default NextExperience;