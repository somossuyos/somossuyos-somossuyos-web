import { X } from 'lucide-react';
import { Event } from '@/src/entities/Event';
import { useRouter } from 'next/router';
import { useCalendar } from '@/src/customHooks/useCalendar';
import CalendarHeader from './CalendarHeader';
import CalendarModalBody from './CalendarModalBody';

interface CalendarComponentProps {
  initialEvents: Event[]
}

// eslint-disable-next-line max-lines-per-function
export default function CalendarComponent({ initialEvents = [] }: CalendarComponentProps) {
  const router = useRouter();
  const { month, type } = router.query;

  const {
    currentDate,
    selectedDate,
    showDayCard,
    events,
    months,
    daysOfWeek,
    getEventColor,
    getDaysInMonth,
    navigateMonth,
    goToToday,
    handleDayClick,
    handleModalClick,
    closeDayCard
  } = useCalendar(initialEvents);

  if (month || type) {
    return null;
  }

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen px-[5%] bg-black">
      <CalendarHeader
        currentDate={currentDate}
        navigateMonth={navigateMonth}
        goToToday={goToToday}
        months={months}
      />
      {/* Calendar Grid */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-7 gap-px mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-300">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            {days.map((day, index) => {
              const [dateKey] = day.fullDate.toISOString().split('T');
              const dayEvents = events[dateKey] || [];

              return (
                <div
                  key={'day-' + index}
                  className={`bg-black/90 min-h-[120px] xl:w-[10vw] 2xl:w-[8vw] p-2 cursor-pointer hover:bg-pale-skin/10 transition-colors ${!day.isCurrentMonth ? 'text-gray-600' : 'text-gray-200'} ${day.isToday ? 'bg-blue-900/50' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <p className={`flex items-center mb-2 text-sm font-medium ${day.isToday ? 'bg-pale-skin text-black w-6 h-6 rounded-full justify-center' : 'justify-between'}`}>
                    {day.date}
                  </p>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <section
                        key={`${event.id}-${day.date}`}
                        className={`text-xs p-1 rounded text-white truncate shadow-sm flex items-center gap-1 ${getEventColor(event.type)}`}
                      >
                        <p className="font-medium truncate">{event.hour} {event.title}</p>
                      </section>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-400 pl-1">+{dayEvents.length - 3} más</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {showDayCard && selectedDate && (
        <div
          className="fixed inset-0 p-4 bg-black bg-opacity-70 flex justify-center items-center z-[1000]"
          onClick={handleModalClick}
        >
          <div
            className="bg-gray-900 rounded-xl shadow-xl w-fit max-w-[90vw] h-fit max-h-[80vh] min-h-[300px] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-medium text-white">{selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
              <button onClick={closeDayCard} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <h4 className="font-medium mb-3 text-white">Eventos del día</h4>
              <CalendarModalBody selectedDate={selectedDate} events={events} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}