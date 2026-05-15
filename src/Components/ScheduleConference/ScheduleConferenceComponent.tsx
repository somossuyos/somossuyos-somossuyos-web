import React from 'react';
import ScheduleConferenceForm from './ScheduleConferenceForm';

const ScheduleConferenceComponent = () => {
  return (
    <div className=' pt-[150px] xl:pt-[200px] 2xl:pt-[250px] flex flex-col items-center justify-center'>
      <div className='flex flex-col '>
        <h2 className='ml-[40px] sm:ml-[75px] xl:ml-[150px] font-stretch-pro text-[25px] sm:text-[80px] leading-[20px] sm:leading-[70px] relative z-10'>Agendar <br />
          <span className='font-dark-twenty text-[34px] sm:text-[104px] text-pale-skin'>Conferencia</span>
        </h2>
        <ScheduleConferenceForm />
      </div>
    </div>
  );
};

export default ScheduleConferenceComponent;