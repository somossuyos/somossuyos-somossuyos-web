import CalendarComponent from '@/src/Components/Calendar/CalendarComponent';
import { Event } from '@/src/entities/Event';
import { EventsDTO } from '@/src/infrastructure/DTOs/Events/EventsDTO';
import { eventsRepository } from '@/src/infrastructure/repositories/events.repository';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { mapEventFromDTO } from '@/src/utils/calendarHelpers';

export const getServerSideProps: GetServerSideProps = async () => {
  const allEventsResponse = await eventsRepository.getEvents() as EventsDTO;
  const allEvents: Event[] = allEventsResponse.data?.map(mapEventFromDTO) ?? [];

  return {
    props: {
      initialEvents: allEvents,
      events: allEvents,
    },
  };
};

export type CalendarPageProps = {
  initialEvents: Event[];
  events: Event[];
};

const CalendarPage = (props: CalendarPageProps) => {
  const { initialEvents } = props;

  return (
    <>
      <Head>
        <title>Calendario - Somos Suyos</title>
      </Head>
      <div className='min-h-screen bg-black pt-[150px] xl:pt-[200px] 2xl:pt-[250px]'>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex flex-col sm:flex-row px-4 sm:px-[30px] xl:px-[120px] 2xl:px-[170px] items-center justify-between relative mb-10'>
            <h1 className='text-[55px] sm:text-[65px] xl:text-[90px] 2xl:text-[110px] font-dark-twenty text-pale-skin leading-none 2xl:leading-[70px] self-start sm:self-auto'>
              Próximos <br />
              <span className='font-stretch-pro text-white text-[30px] sm:text-[40px] xl:text-[70px] 2xl:text-[77px] inline-block sm:ml-8'>
                Eventos
              </span>
            </h1>
          </div>
          <CalendarComponent initialEvents={initialEvents} />
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
