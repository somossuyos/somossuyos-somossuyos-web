import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import TruncatedText from '@/src/Components/Utils/TruncatedText';

export type ExperienceProps = {
  src?: string;
  month?: string;
  title: string;
  path: string;
  isDateSet: boolean;
  canInscribe?: boolean;
  soldOut?: boolean;
};

const Experience = ({ src, month, title, path, isDateSet, soldOut, canInscribe }: ExperienceProps) => {

  const router = useRouter();

  return (
    <div className='max-w-[400px] sm:w-[175px] xl:w-[200px] 2xl:w-[260px] flex sm:flex-col gap-2 sm:gap-0 px-8 sm:px-0 items-end'>
      <div className='relative w-full'>
        <Image
          src={src ?? '/img/experiencias/thmu_experiencias.png'}
          alt={title}
          width={260}
          height={400}
          className={`${src ? 'border-transparent' : 'border-pale-skin'} border-2 rounded-t-full overflow-hidden relative z-0 w-full aspect-[260/400]`}
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
      <div className='w-full -translate-y-10 sm:translate-y-0 h-fit'>
        {
          month &&
          <p className='font-futura sm:text-[20px] sm:my-3'>
            {
              isDateSet ?
                month :
                'Próximamente'
            }
          </p>
        }
        <div className='w-full h-[2px] bg-pale-skin my-2 -translate-x-1/2 sm:hidden'></div>
        <TruncatedText
          text={title}
          maxLines={2}
          className='font-bold font-futura lg:text-[20px] text-gold mt-4'
        />
        {
          (
            router.pathname === '/recursos' ||
            router.pathname === '/blog' ||
            router.pathname === '/' ||
            router.pathname === '/eventos' ||
            router.pathname.includes('/eventos/realizados') ||
            router.pathname.includes('/experiencia')
          ) &&
          canInscribe && path &&
          < Link href={path} className='my-3 inline-block p-2 bg-pale-skin text-black font-futura rounded-[10px]'>
            Ver más
          </Link>
        }
        {
          (
            router.pathname === '/recursos' ||
            router.pathname === '/blog' ||
            router.pathname === '/' ||
            router.pathname === '/eventos' ||
            router.pathname.includes('/eventos/realizados') ||
            router.pathname.includes('/experiencia')
          ) &&
          !canInscribe &&
          soldOut && path &&
          < Link href={path} className='my-3 inline-block p-2 bg-pale-skin text-black font-futura rounded-[10px]'>
            Ver más
          </Link>
        }
      </div>
    </div >
  );
};

export default Experience;