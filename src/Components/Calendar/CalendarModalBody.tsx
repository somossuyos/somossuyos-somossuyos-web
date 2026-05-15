import React from 'react';
import { Event } from '@/src/entities/Event';
import Image from 'next/image';
import Link from 'next/link';

type CalendarModalProps = {
  selectedDate: Date;
  events: {
    [key: string]: Event[];
  };
};

const CalendarModalBody = ({ selectedDate, events }: CalendarModalProps) => {
  const [dateKey] = selectedDate.toISOString().split('T');
  const dayEvents = events[dateKey] || [];

  if (dayEvents.length === 0) {
    return <div className="text-center py-8">
      <div className="text-gray-600 mb-2">📅</div>
      <p className="text-gray-400 text-sm">No hay eventos para este día</p>
    </div>;
  }

  return (
    <section className="h-full">
      {dayEvents.map((event) => (
        <div
          key={`${event.id}-${selectedDate.toISOString()}`}
          className="flex justify-between mb-12 gap-4 rounded-2xl bg-black/20 hover:bg-black/70 transition-colors"
        >
          {event.thumbnail && (
            <div className="rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={event.thumbnail}
                alt={event.title}
                objectFit="cover"
                width={250}
                height={300}
              />
            </div>
          )}
          <div className="flex flex-col p-4 justify-between w-full min-h-full">
            <div className="w-full flex flex-col space-y-4">
              {event.type === 'Online' && (
                <>
                  <p className='font-futura text-[22px] leading-[26px] mt-0 text-pale-skin'>{event.collaboration}</p>
                  <div className='flex flex-col gap-2 mt-3'>
                    <p className='font-futura text-[39px]'>{event.day}</p>
                    <p className='font-stretch-pro text-[24px] leading-none text-gold'>{event.title}</p>
                  </div>
                </>
              )}
              {event.type === 'Presencial' && (
                <>
                  <div className='w-full flex items-center justify-between h-fit'>
                    <p className='text-[39px] leading-[39px] h-fit'>{event.day}</p>
                    <div className='flex flex-col items-end justify-between h-full w-[30%]'>
                      <p className='text-[13px]'>{event.isOwn ? 'EVENTO PROPIO' : 'INVITADA'}</p>
                      <div className={`h-1 w-full mt-3 ${event.isOwn ? 'bg-custom-red' : 'bg-white'}`}></div>
                    </div>
                  </div>
                  <p className='font-futura font-bold text-gold mt-1 text-[25px] leading-[30px]'>{event.title}</p>
                  <p className={`uppercase ${event.isOwn ? 'text-custom-red' : 'text-white'}`}>{event.type} · {event.location}</p>
                </>
              )}
            </div>
            {event.link && !event.isOwn && (
              <div className="mt-auto pt-4">
                <Link
                  href={event.link}
                  className="w-full px-4 py-2 border border-pale-skin font-futura text-[18px] text-pale-skin rounded-[20px] text-center block"
                >
                  Ver más
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default CalendarModalBody;