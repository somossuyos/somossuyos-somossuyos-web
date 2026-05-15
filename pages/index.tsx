import HomepageComponent from '@/src/Components/Homepage/HomepageComponent';
import { NextExperienceProps } from '@/src/Components/Homepage/NextExperience';
import { Event } from '@/src/entities/Event';
import { NextEventsDTO } from '@/src/infrastructure/DTOs/Home/NextEventsDTO';
import { eventsRepository } from '@/src/infrastructure/repositories/events.repository';
import { experiencesRepository } from '@/src/infrastructure/repositories/experience.repository';
import { experienceMonthLabel } from '@/src/utils/experienceDisplayDates';
import { formatDates } from '@/src/utils/formatDates';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { HomeExperience } from '@/src/Components/Homepage/Experiences/Experencies';

export const getStaticProps: GetStaticProps = async () => {

  const rawData = await experiencesRepository.getHomeNextExperience();
  const [nextExperienceData] = rawData.data ?? [];
  const nextExperience = {
    id: nextExperienceData?.id ?? 0,
    slug: nextExperienceData?.attributes?.slug ?? '',
    month: nextExperienceData?.id
      ? experienceMonthLabel(nextExperienceData.id, nextExperienceData.attributes?.Fecha)
      : '',
    type: nextExperienceData?.attributes?.Tipo ?? '',
    header: {
      firstPart: nextExperienceData?.attributes?.Encabezado?.Titulos?.[0]?.contenido ?? '',
      secondPart: nextExperienceData?.attributes?.Encabezado?.Titulos?.[1]?.contenido ?? ''
    }
  };

  const nextExperiencesResponse = await experiencesRepository.getHomeExperiences();
  const experiences = nextExperiencesResponse.data?.map((experience) => {
    const month = experienceMonthLabel(experience.id, experience.attributes.Fecha);
    return {
      id: experience.id,
      thumbnail: experience.attributes.Miniatura?.data?.attributes?.url ?? null,
      month,
      link: `/eventos/${experience.id}`,
      title: experience.attributes.Titulo,
      isDateSet: experience.attributes.Fecha !== null,
      canInscribe: experience.attributes.habilitar_inscripcion ?? false,
      soldOut: experience.attributes.vendido ?? false,
    };
  }) ?? [];


  const eventsResponse = await eventsRepository.getHomeNextEvent() as NextEventsDTO;
  const events = eventsResponse.data?.map((event) => {
    const month = formatDates(event.attributes.Fecha);
    return {
      id: event.id,
      title: event.attributes.Titulo,
      location: event.attributes.Ubicacion,
      month,
      day: event.attributes.Dia,
      link: event.attributes.Link ?? '/calendario'
    };
  }) ?? [];

  return {
    props: {
      nextExperience,
      experiences,
      events
    },
    revalidate: 300
  };
};

export type HomePageProps = {
  nextExperience: NextExperienceProps;
  experiences:  HomeExperience[];
  events: Event[];
};

export default function Home(props: HomePageProps) {
  return <>
    <Head>
      <title>Somos suyos</title>
      <meta name="description" content="Home page" />
    </Head>
    <HomepageComponent {...props} />
  </>;
}
