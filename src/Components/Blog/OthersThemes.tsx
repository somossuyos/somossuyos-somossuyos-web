import Image from 'next/image';
import Link from 'next/link';
import { ExperienceProps } from '../Homepage/Experiences/Experience';
import TruncatedText from '@/src/Components/Utils/TruncatedText';

type OthersThemesProps = Omit<ExperienceProps, 'month'>;

const OthersThemes = ({ src, title, path }: OthersThemesProps) => {
  return (
    <div className='sm:w-[30%] xl:w-[200px] 2xl:w-[260px] flex md:flex-col gap-2 md:gap-0 px-4 md:px-0 items-end'>
      <Image
        src={src ?? ''}
        alt={title}
        width={260}
        height={400}
        className='rounded-t-full overflow-hidden'
      />
      <div className='w-full'>
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

export default OthersThemes;