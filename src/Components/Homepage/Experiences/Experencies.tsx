import React from 'react';
import Marquee from 'react-fast-marquee';
import ExperienceComponent from './Experience';
import AnimatedHand from './AnimatedHand';

export type HomeExperience ={
  id: number,
  thumbnail: string,
  month:string,
  path: string,
  title: string,
  isDateSet: boolean,
  canInscribe: boolean,
  soldOut: boolean,
}
export type ExperiencesProps = {
  experiences: HomeExperience[]
};

const Experencies = ({ experiences }: ExperiencesProps) => {
  return (
    <div className='pt-[50px] sm:pt-[150px] xl:pt-[380px] 2xl:pt-[400px] pb-[140px] relative overflow-hidden' id='experiences-section'>
      <AnimatedHand />
      <p className='mx-[44px] sm:mx-[80px] xl:mx-[150px] 2xl:mx-[240px] font-stretch-pro leading-none sm:leading-[50px] text-[28px] sm:text-[40px] xl:text-[60px] 2xl:text-[70px]'>Experiencias <br />
        <span className='font-dark-twenty text-pale-skin text-[35px] sm:text-[50px] xl:text-[75px] 2xl:text-[100px]'>Presenciales</span>
      </p>
      <Marquee className='-mt-5 sm:-mt-16 2xl:-mt-20'>
        <p className='text-border text-black font-stretch-pro text-[150px] sm:text-[200px] xl:text-[300px] 2xl:text-[400px] pointer-events-none'>Experiencias Presenciales</p>
      </Marquee>
      <div className='flex flex-col sm:flex-row flex-wrap items-center justify-center gap-[20px] sm:gap-[40px] xl:gap-[80px] 2xl:gap-[100px] -mt-[80px] sm:-mt-[120px] xl:-mt-[180px] 2xl:-mt-[250px] relative z-20'>
        {
          experiences.map((experience) => (
            <ExperienceComponent
              key={`${experience.id}-${experience.title}`}
              src={experience.thumbnail}
              month={experience.month}
              title={experience.title}
              path={experience.path}
              isDateSet={experience.isDateSet}
              canInscribe={experience.canInscribe}
              soldOut={experience.soldOut}
            />
          ))
        }
      </div>
    </div>
  );
};

export default Experencies;