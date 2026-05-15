import { useState } from 'react';
import { Event } from '@/src/entities/Event';

interface CalendarDay {
  fullDate: Date;
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

const getLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isSameDate = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

// eslint-disable-next-line max-lines-per-function
export const useCalendar = (initialEvents: Event[] = []) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayCard, setShowDayCard] = useState(false);

  const events = initialEvents.reduce((acc: { [key: string]: Event[] }, event: Event) => {
    const date = new Date(event.date);
    const dateKey = getLocalDateKey(date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  const getEventColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      presencial: 'bg-blue-500',
      live: 'bg-red-500',
      online: 'bg-green-500',
      default: 'bg-gray-500'
    };
    return colors[type.toLowerCase()] || colors.default;
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: CalendarDay[] = [];
    const today = new Date();
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthNumber = month === 0 ? 11 : month - 1;

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayDate = prevMonthDays - i;
      const fullDate = new Date(prevMonthYear, prevMonthNumber, dayDate);
      const dateKey = getLocalDateKey(fullDate);
      days.push({
        fullDate,
        date: dayDate,
        isCurrentMonth: false,
        isToday: false,
        events: events[dateKey] || [],
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      const isToday = isSameDate(today, fullDate);
      const dateKey = getLocalDateKey(fullDate);

      days.push({
        fullDate,
        date: day,
        isCurrentMonth: true,
        isToday,
        events: events[dateKey] || [],
      });
    }

    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthNumber = month === 11 ? 0 : month + 1;

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const fullDate = new Date(nextMonthYear, nextMonthNumber, day);
      const dateKey = getLocalDateKey(fullDate);
      days.push({
        fullDate,
        date: day,
        isCurrentMonth: false,
        isToday: false,
        events: events[dateKey] || [],
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDate(day.fullDate);
    setShowDayCard(true);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowDayCard(false);
    }
  };

  const closeDayCard = () => {
    setShowDayCard(false);
  };

  return {
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
    closeDayCard,
    getLocalDateKey,
    isSameDate
  };
};