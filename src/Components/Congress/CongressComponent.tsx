import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import Link from 'next/link';
import CongressConferenceCard from './CongressConferenceCard';

type CongressComponentProps = {
  month: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  collaborators: string;
  movingText: string;
  canInscribe: boolean;
  additionalContent: string;
  conferences: {
    name: string;
    position: string;
    profile: string;
    images: string[];
  }[];
};



type HeaderSectionProps = Omit<CongressComponentProps, 'movingText' | 'conferences' | 'additionalContent'>;
const HeaderSection = ({ month, title, description, thumbnail, duration, collaborators, canInscribe }: HeaderSectionProps) => (
  <div className='flex flex-col sm:flex-row sm:pl-8 xl:pl-[80px] gap-6 xl:gap-8 2xl:gap-[50px] relative z-10'>
    <Image
      className='overflow-hidden w-[80%] sm:w-[200px] xl:w-[400px] h-auto sm:h-[200px] xl:h-[400px] flex-shrink-0 flex-grow-0 aspect-square p-8 pl-0 sm:p-0 border border-l-0 sm:border-0 border-pale-skin rounded-r-[26px]'
      src={thumbnail}
      alt={`Imagen de ${title}`}
      width={480}
      height={480}
      priority
    />
    <div className='font-futura w-full sm:max-w-[30vw] md:max-w-[35vw] lg:max-w-[50vw] xl:max-w-[40vw] 2xl:max-w-[45vw] lg:text-[21px] px-4 sm:px-0'>
      <p>{month}</p>
      <h1 className='font-stretch-pro text-[25px] xl:text-[32px] leading-none text-gold'>{title}</h1>
      <p dangerouslySetInnerHTML={{ __html: description }} className='w-full'></p>
    </div>
    <div className='relative w-fit'>
      <p className='font-bold text-[18px] leading-[20px] border-2 w-fit border-pale-skin pt-20 px-5 xl:px-10 pb-5 rounded-t-full mt-5 mx-4 sm:mx-0'><span className='text-[50px] 2xl:text-[81px] font-stretch-pro'>{collaborators.split(' ')[0]}</span> <br />{collaborators.split(' ')[1]}</p>
      <p className='mx-4 sm:mx-0 font-futura font-bold 2xl:text-[21px] leading-none relative mt-2 w-fit'>DURACIÓN <br /> DE LA <br /> EXPERIENCIA
        <span
          className='flex flex-col items-center justify-center leading-none absolute top-0 right-0 font-stretch-pro text-[30px] 2xl:text-[55px] text-center bg-pale-skin text-black rounded-full w-[100px] 2xl:w-[150px] h-[100px] 2xl:h-[150px]'
          style={{
            transform: 'translate(110%, -30%)'
          }}
        >
          {duration.split(' ')[0]}
          <br />
          <span className='font-futura text-[25px]'>
            {duration.split(' ')[1]}
          </span>
        </span>
      </p>
      {
        canInscribe &&
        <Link
          href={'/eventos/congreso/inscripcion'}
          className={'inline-block w-fit rounded-[28px] border-2 px-5 sm:px-10 py-3 sm:py-5 bg-black border-pale-skin sm:mt-[50px] xl:mt-[100px] font-stretch-pro sm:text-[20px] xl:text-[26px] leading-none 2xl:leading-[34px] text-pale-skin'}
        >
          Inscríbete
        </Link >
      }
    </div>
  </div>
);

type MarqueeSectionProps = { movingText: string };
const MarqueeSection = ({ movingText }: MarqueeSectionProps) => (
  <div className='absolute top-[200px] w-full overflow-x-hidden opacity-25'>
    <Marquee className=''>
      <p className='font-stretch-pro text-border text-[400px] pointer-events-none text-black relative z-0'>{movingText ?? 'Congreso'}</p>
    </Marquee>
  </div>
);

type ConferencesSectionProps = { conferences: CongressComponentProps['conferences'] };
const ConferencesSection = ({ conferences }: ConferencesSectionProps) => (
  <div className='px-[10%] xl:px-[80px] grid xl:grid-cols-2 gap-5 xl:gap-10 mt-5 lg:mt-10'>
    {conferences.map((conf) => (
      <CongressConferenceCard
        {...conf}
        key={`conference-${conf.name}`}
      />
    ))}
  </div>
);

type AdditionalContentSectionProps = { additionalContent: string };
const AdditionalContentSection = ({ additionalContent }: AdditionalContentSectionProps) => (
  <div className='px-[10%]  mt-10 flex flex-col gap-2 lg:text-[21px]'>
    <div dangerouslySetInnerHTML={{ __html: additionalContent }}></div>
  </div>
);

const CongressComponent = ({ month, title, description, thumbnail, duration, collaborators, movingText, conferences, canInscribe, additionalContent }: CongressComponentProps) => {
  return (
    <div className='pt-[150px] sm:pt-[250px] relative'>
      <HeaderSection
        month={month}
        title={title}
        description={description}
        thumbnail={thumbnail}
        duration={duration}
        collaborators={collaborators}
        canInscribe={canInscribe}
      />
      <MarqueeSection movingText={movingText} />
      <ConferencesSection conferences={conferences} />
      <AdditionalContentSection additionalContent={additionalContent} />
    </div>
  );
};

export default CongressComponent;