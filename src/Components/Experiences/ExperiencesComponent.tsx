import Marquee from 'react-fast-marquee';
import Experience from '../Homepage/Experiences/Experience';

export type ExperienceListItem = {
  slug: string
  thumbnail: string ;
  month: string;
  path: string;
  title: string;
  isDateSet: boolean;
  canInscribe: boolean;
  soldOut: boolean;
  type?: string;
};

type ExperiencesComponentProps = {
  experiences: ExperienceListItem[];
};

const ExperiencesComponent = ({ experiences }: ExperiencesComponentProps) => {
  const presencialExperiences = experiences.filter(exp => exp.type === 'Presencial');
  const onlineExperiences = experiences.filter(exp => exp.type === 'Online');

  return (
    <div className='min-h-screen pt-[150px] xl:pt-[200px] 2xl:pt-[300px]'>
      {presencialExperiences.length > 0 && (
        <>
          <h2 className='ml-8 sm:ml-[100px] xl:ml-[175px] 2xl:ml-[250px] font-stretch-pro text-[25px] sm:text-[40px] xl:text-[60px] 2xl:text-[80px] leading-none 2xl:leading-[70px] relative z-10'>Eventos <br />
            <span className='font-dark-twenty text-[35px] sm:text-[50px] xl:text-[80px] 2xl:text-[104px] text-pale-skin'>Presenciales</span>
          </h2>
          <Marquee className='-mt-[150px] xl:-mt-[200px] 2xl:-mt-[320px] relative z-0'>
            <p className='font-stretch-pro text-border text-[200px] xl:text-[300px] 2xl:text-[400px] text-black pointer-events-none'>Eventos</p>
          </Marquee>
          <div className='px-4 sm:px-[6%] xl:px-[12%] flex flex-wrap gap-[110px] relative z-10 -mt-[100px] xl:-mt-[200px]'>
            {presencialExperiences.map(({ month, path, slug, title, thumbnail, isDateSet, canInscribe, soldOut }) => (
              <Experience
                key={`presencial-${slug}`}
                month={month}
                title={title}
                path={path}
                src={thumbnail ?? undefined}
                isDateSet={isDateSet}
                canInscribe={canInscribe}
                soldOut={soldOut}
              />
            ))}
          </div>
        </>
      )}
      {onlineExperiences.length > 0 && (
        <>
          <h2 className='ml-8 sm:ml-[100px] xl:ml-[175px] 2xl:ml-[250px] font-stretch-pro text-[25px] sm:text-[40px] xl:text-[60px] 2xl:text-[80px] leading-none 2xl:leading-[70px] relative z-10 mt-20'>Eventos <br />
            <span className='font-dark-twenty text-[35px] sm:text-[50px] xl:text-[80px] 2xl:text-[104px] text-pale-skin'>Online</span>
          </h2>
          <Marquee className='-mt-[150px] xl:-mt-[200px] 2xl:-mt-[320px] relative z-0'>
            <p className='font-stretch-pro text-border text-[200px] xl:text-[300px] 2xl:text-[400px] text-black pointer-events-none'>Eventos</p>
          </Marquee>
          <div className='px-4 sm:px-[6%] xl:px-[12%] flex flex-wrap gap-[110px] relative z-10 -mt-[100px] xl:-mt-[200px]'>
            {onlineExperiences.map(({ month, path, slug, title, thumbnail, isDateSet, canInscribe, soldOut }) => (
              <Experience
                key={`online-${slug}`}
                month={month}
                title={title}
                path={path}
                src={thumbnail ?? undefined}
                isDateSet={isDateSet}
                canInscribe={canInscribe}
                soldOut={soldOut}
              />
            ))}
          </div>
        </>
      )}
      {experiences.length === 0 && (
        <div className='px-4 sm:px-[6%] xl:px-[12%]'>
          <p className='font-stretch-pro text-[30px] leading-none mt-36'>
            No tenemos eventos programados, vuelve a visitarnos para enterarte de todos los próximos eventos
          </p>
        </div>
      )}
    </div>
  );
};

export default ExperiencesComponent;