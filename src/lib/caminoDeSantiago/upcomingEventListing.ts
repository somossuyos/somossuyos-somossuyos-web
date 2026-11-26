import type { ExperienceListItem } from '@/src/Components/Experiences/ExperiencesComponent';
import { caminoDeSantiagoContent } from '@/src/lib/caminoDeSantiago/content';
import { isCaminoInscriptionsEnabled } from '@/src/lib/caminoDeSantiago/featureFlags';

/** Tarjeta de Camino en «Próximos eventos» (no vive como experiencia en Strapi). */
export function getCaminoSantiagoUpcomingListItem(): ExperienceListItem {
  return {
    slug: 'camino-de-santiago',
    title: 'PEREGRINACIÓN CAMINO DE SANTIAGO + FÁTIMA',
    thumbnail: caminoDeSantiagoContent.hero.imageUrl,
    path: '/camino-de-santiago',
    month: 'Junio 2027',
    isDateSet: true,
    canInscribe: isCaminoInscriptionsEnabled(),
    soldOut: false,
    type: 'Presencial',
  };
}

export function mergeCaminoIntoUpcomingExperiences<T extends ExperienceListItem>(items: T[]): T[] {
  const camino = getCaminoSantiagoUpcomingListItem() as T;
  const withoutDup = items.filter((e) => e.slug !== camino.slug);
  return [camino, ...withoutDup];
}