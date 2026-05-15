import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CalendarHeaderProps = {
  currentDate: Date;
  months: string[];
  // eslint-disable-next-line no-unused-vars
  navigateMonth: (direction: 'next' | 'prev') => void;
  goToToday: () => void;
};

const CalendarHeader = ({ months, currentDate, navigateMonth, goToToday }: CalendarHeaderProps) => {
  return (
    <header className="bg-black/80 border-b border-gray-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-2">
        <p className="w-6 h-6 bg-pale-skin rounded-sm flex items-center justify-center p-5 text-black text-sm font-bold">
          {new Date().getDate()}
        </p>
        <h2 className="text-xl font-normal text-white">Calendario</h2>
      </div>
      <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 sm:gap-4">
        {/* Mes y año - se mueve arriba en móvil */}
        <h2 className="text-lg sm:text-xl font-normal text-white order-1 sm:order-3">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={goToToday}
          className="px-3 py-2 text-sm border border-gray-700 rounded-md hover:bg-gray-800 transition-colors text-white order-2 sm:order-1 flex-shrink-0"
        >
          Hoy
        </button>
        <div className="flex items-center gap-1 order-3 sm:order-2 flex-shrink-0">
          <button
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-800 rounded-md transition-colors text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 flex items-center justify-center hover:bg-gray-800 rounded-md transition-colors text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;