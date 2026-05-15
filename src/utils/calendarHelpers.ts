import { Event } from '@/src/entities/Event';
import { EventsDatum } from '@/src/infrastructure/DTOs/Events/EventsDTO';
import { formatDates, formatHoursFromDate } from '@/src/utils/formatDates';

export const mapEventFromDTO = (event: EventsDatum): Event => {
  const date = new Date(event.attributes.Fecha);
  return {
    id: typeof event.id === 'string' ? parseInt(event.id, 10) : event.id,
    title: event.attributes.Titulo,
    location: event.attributes.Ubicacion,
    collaboration: event.attributes.Colaboracion ?? '',
    isOwn: event.attributes.Colaboracion === null,
    day: event.attributes.Dia,
    duration: event.attributes.Duracion || '',
    link: event.attributes.Link,
    month: formatDates(event.attributes.Fecha),
    hour: formatHoursFromDate(event.attributes.Fecha),
    type: event.attributes.Tipo,
    description: event.attributes.Descripcion || '',
    banner: event.attributes.Banner?.data?.attributes?.url || '',
    thumbnail: event.attributes.Miniatura.data?.attributes.url ?? null,
    collaborators: event.attributes.Integrantes || '',
    bannerTitle: event.attributes.Titulo || '',
    movingText: event.attributes.Titulo || '',
    date: date.toISOString()
  };
};