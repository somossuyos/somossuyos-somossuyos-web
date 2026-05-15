import Marquee from 'react-fast-marquee';
import Experience from '../Homepage/Experiences/Experience';
import { ExperiencesProps } from '@/pages/eventos';

type ExperiencesComponentProps = ExperiencesProps;

const FinishedExperiencesComponent = ({ experiences }: ExperiencesComponentProps) => {
  return (
    <div className='min-h-screen pt-[150px] xl:pt-[200px] 2xl:pt-[300px]'>
      <h2 className='ml-8 sm:ml-[100px] xl:ml-[175px] 2xl:ml-[250px] font-stretch-pro text-[25px] sm:text-[40px] xl:text-[60px] 2xl:text-[80px] leading-none 2xl:leading-[70px] relative z-10'>Eventos <br />
        <span className='font-dark-twenty text-[35px] sm:text-[50px] xl:text-[80px] 2xl:text-[104px] text-pale-skin'>Realizados</span>
      </h2>
      <Marquee className='-mt-[150px] xl:-mt-[200px] 2xl:-mt-[320px] relative z-0'>
        <p className='font-stretch-pro text-border text-[200px] xl:text-[300px] 2xl:text-[400px] text-black pointer-events-none'>Eventos</p>
      </Marquee>
      <div className='px-4 sm:px-[6%] xl:px-[12%] flex flex-wrap gap-[110px] relative z-10 -mt-[100px] xl:-mt-[200px]'>
        {
          experiences.length === 0 && <p className='font-stretch-pro text-[30px] leading-none mt-36'>
            No tenemos eventos realizados, vuelve a visitarnos para enterarte de todos los próximos eventos
          </p>
        }
        {
          experiences?.map(({ month, path, slug, title, thumbnail, isDateSet, canInscribe, soldOut }) => (
            <Experience
              key={`experience-${slug}`}
              month={month}
              title={title}
              path={path}
              src={thumbnail}
              isDateSet={isDateSet}
              canInscribe={canInscribe}
              soldOut={soldOut}
            />
          ))
        }
      </div>
    </div>
  );
};

export default FinishedExperiencesComponent;