export const formatDates = (date: string | Date | null | undefined) => {
  if (date === null || date === undefined) {
    return '';
  }
  const newDate = new Date(date);
  if (Number.isNaN(newDate.getTime())) {
    return '';
  }
  const month = newDate.toLocaleString('es-ES', { month: 'long' });
  return month.toLocaleUpperCase();
};

export const formatHoursFromDate = (date: string | Date) => {
  const newDate = new Date(date);
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const finalHours = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  return finalHours;
};

export const formatHours = (date: string) => {
  const hours = date.split(':');
  const finalHours = `${hours[0]}:${hours[1]}`;
  return finalHours;
};