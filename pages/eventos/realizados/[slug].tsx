import { experiencesRepository } from '@/src/infrastructure/repositories/experience.repository';
import { formatDates, formatHours } from '@/src/utils/formatDates';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import FinishedExperienceComponent, { FinishedExperienceComponentData } from '@/src/Components/Experience/Finished/FinishedExperienceComponent';
import { ActivityDto, SpeakerDto } from '@/src/infrastructure/DTOs/Experiences/ExperienceDTO';
import { Media, MediaData } from '@/src/entities/types/SharedTypes';

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const slug = ctx.params?.slug;

  if (!slug) { return { notFound: true } }

  const data = await experiencesRepository.getExperienceBySlug(slug as string);
  const arrayData = data.data[0].attributes;

  if (!data || !arrayData) { return { notFound: true } }

  if (arrayData.Estado !== 'Finalizado') {
    return {
      notFound: true
    };
  }

  const month = formatDates(arrayData.Fecha);
  const date = new Date(arrayData.Fecha).getDate();
  const hour = arrayData.Hora ? formatHours(arrayData.Hora) : '';

  const activity: ActivityDto | null = arrayData.Actividad ? {
    id: arrayData.Actividad.id || 0,
    title: arrayData.Actividad.Titulo || '',
    quantity: arrayData.Actividad.Cantidad || 0,
    duration: arrayData.Actividad.Duracion || '',
    subactivities: arrayData.Actividad.Subactividades?.map((sub: { id: number; Nombre: string | null }) => ({
      id: sub.id || 0,
      name: sub.Nombre || null
    })) || []
  } : null;

  const exposers: SpeakerDto[] = arrayData.expositores?.map((expositor: {
    id: number;
    nombres: string;
    afiliacion: string;
    descripcion: string;
    foto: MediaData<Media> | null;
    foto_afiliacion: MediaData<Media> | null;
  }) => ({
    id: expositor.id || 0,
    names: expositor.nombres || '',
    affiliation: expositor.afiliacion || '',
    description: expositor.descripcion || '',
    photo: expositor.foto || undefined,
    affiliationPhoto: expositor.foto_afiliacion || undefined
  })) || [];

  const finishedEvent: FinishedExperienceComponentData = {
    slug: arrayData.slug || '',
    thumbnail: arrayData.Miniatura?.data?.attributes?.url ?? '',
    title: arrayData.Titulo,
    month,
    description: arrayData.Descripcion,
    type: arrayData.Tipo?.toLowerCase() || '',
    theme: arrayData.Tematica || '',
    header: {
      firstPart: arrayData.Encabezado?.Titulos?.[0]?.contenido || '',
      secondPart: arrayData.Encabezado?.Titulos?.[1]?.contenido || ''
    },
    activity,
    date,
    hour,
    isDateSet: arrayData.Fecha !== null,
    exposers,
    extras: arrayData.adicionales || '',
    mosaicImage: arrayData.Mosaico?.data?.attributes?.url || '',
    movingText: 'Realizado',
  };

  return {
    props: {
      event: finishedEvent
    }
  };
};

export type FinishedExperiencePageProps = {
  event: FinishedExperienceComponentData;
};

const FinishedExperiencePage = ({ event }: FinishedExperiencePageProps) => {
  return <>
    <Head>
      <title>{event.title}</title>
    </Head>
    <FinishedExperienceComponent event={event} />
  </>;
};

export default FinishedExperiencePage;