import SLateral from '@/public/img/home/S_lateral_izq.png';
import Image from 'next/image';
import NextEvent from './NextEvent';
import { Event } from '@/src/entities/Event';

type NextEventsProps = {
  events: Event[];
}

const NextEvents = ({ events }: NextEventsProps) => {
  return (
    <div className='flex flex-col sm:flex-row items-start justify-between w-full'>
      <div className='relative'>
        <Image
          src={SLateral}
          alt='S lateral izquierdo'
        />
        <p className='font-dark-twenty absolute top-1/2 -translate-y-1/2 left-16 sm:left-10 xl:left-[250px] 2xl:left-[300px] text-[40px] sm:text-[50px] xl:text-[80px] 2xl:text-[100px] leading-none xl:leading-[100px] text-pale-skin'>Próximos <br />
          <span className='font-stretch-pro text-[30px] sm:text-[40px] xl:text-[50px] 2xl:text-[60px] xl:-mt-[20px] 2xl:-mt-[40px] ml-4 sm:ml-14 block text-white'>Eventos</span>
        </p>
      </div>
      <div className='xl:pr-[10%] flex flex-col w-full sm:w-fit'>
        {
          events.map((event, index) => (
            <NextEvent
              key={`next-event-${event.title}-${index}`}
              date={`${event.day}`}
              title={event.title}
              location={event.location}
              href={event.link}
              isLast={index === events.length - 1}
            />
          ))
        }
        {/* <Link href='/calendario' className='block border-pale-skin border px-4 py-2 rounded-full w-fit mt-4 self-center'>
          VER + EVENTOS
        </Link> */}
      </div>
    </div>
  );
};

export default NextEvents;