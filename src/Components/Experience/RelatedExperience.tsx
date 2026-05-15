import Image from 'next/image';
import Link from 'next/link';
import { ExperienceProps } from '../Homepage/Experiences/Experience';
import TruncatedText from '@/src/Components/Utils/TruncatedText';

type RelatedExperienceProps = ExperienceProps;

const RelatedExperience = ({ src, month, title, path, isDateSet, soldOut }: RelatedExperienceProps) => {
  return (
    <div className='max-w-[400px] md:w-[200px] 2xl:w-[260px] flex md:flex-col gap-2 md:gap-0 px-4 md:px-0 items-end relative z-0'>
      <div className='relative w-full h-full md:h-[300px] md:overflow-hidden md:rounded-t-full'>
        <Image
          src={src ?? '/img/experiencias/thmu_experiencias.png'}
          alt={title}
          width={260}
          height={400}
          className='rounded-t-full md:rounded-t-full md:object-cover md:w-full md:h-full'
        />
        {
          soldOut &&
          <div className='absolute top-0 left-0 w-full h-full bg-black rounded-t-full bg-opacity-70 z-0 flex justify-center items-center'>
            <p className='font-futura text-red-500 sm:text-[25px] leading-none border-4 px-4 sm:px-5 py-2 sm:py-4 border-red-500 rounded-md sm:rounded-xl'>
              Sold Out
            </p>
          </div>
        }
      </div>
      <div className='w-full'>
        {
          month &&
          <p className='font-futura md:text-[20px] md:my-3'>
            {
              isDateSet ?
                month :
                'Próximamente'
            }
          </p>
        }
        <div className='w-full h-1 bg-pale-skin my-2 -translate-x-1/2 md:hidden'></div>
        <TruncatedText
          text={title}
          maxLines={2}
          className='font-futura md:text-[20px] text-gold md:text-black leading-none font-bold mt-4'
        />
        <Link href={path} className='my-3 inline-block p-2 text-black md:text-pale-skin bg-pale-skin md:bg-black font-futura rounded-[10px]'>
          + Info
        </Link>
      </div>
    </div>
  );
};

export default RelatedExperience;