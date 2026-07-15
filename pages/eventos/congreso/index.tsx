import CongressComponent from '@/src/Components/Congress/CongressComponent';
import { CongressDTO } from '@/src/infrastructure/DTOs/Congress/CongressDTO';
import { congressRepository } from '@/src/infrastructure/repositories/congress.respository';
import { DateTime } from 'luxon';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { experiencesRepository } from '@/src/infrastructure/repositories/experience.repository';
import { formatDates } from '@/src/utils/formatDates';
import { experienceDataTransform } from '@/src/infrastructure/dataTransformers/ExperienceDataTransformer';


export const getServerSideProps: GetServerSideProps = async () => {
  const zonaHorariaBogota = 'America/Bogota';

  const ahoraBogota = DateTime.local().setZone(zonaHorariaBogota);

  const fechaLimiteFijaBogota = DateTime.fromObject({
    year: 2025,
    month: 5,
    day: 2,
    hour: 23,
    minute: 59,
    second: 0,
  }, { zone: zonaHorariaBogota });

  const isAfterMidnight = ahoraBogota.isValid && ahoraBogota > fechaLimiteFijaBogota;
  const { meta } = await congressRepository.getCongressInscriptionCount() as CongressDTO;
  const rawData = await experiencesRepository.getExperiencesByCategory('congreso');
  const congress = experienceDataTransform(rawData);

  const congressProps = {
    title: congress?.title || '',
    description: congress?.description || '',
    thumbnail: congress?.thumbnail.data.attributes.url ?? '',
    month: congress?.date ? formatDates(congress.date) : '',
    duration: congress?.activity?.duration || '',
    collaborators: `${congress?.activity?.quantity || ''} ${congress?.activity?.title || ''}`,
    movingText: congress?.status || '',
    additionalContent: congress?.additional || '',
  };

  const conferences = congress?.speakers?.map(speaker => {
    const imagesArray = [];
    if (speaker?.photo) {
      imagesArray.push(speaker.photo);
    }
    if (speaker.affiliationPhoto) {
      imagesArray.push(speaker.affiliationPhoto);
    }

    return ({
      name: speaker.names,
      position: speaker.affiliation,
      profile: speaker.description,
      images: imagesArray,
    });
  }) || [];

  return {
    props: {
      ...congressProps,
      canInscribe: meta.pagination.total < 400 && !isAfterMidnight,
      conferences,
    },
  };

};

export type CongressPageProps = {
  canInscribe: boolean;
  conferences: {
    name: string;
    position: string;
    profile: string;
    images: string[];
  }[];
  month: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  collaborators: string;
  movingText: string;
  additionalContent: string;
};

const congreso = (props: CongressPageProps) => {
  return <>
    <Head>
      <title>Congreso RenaSER</title>
    </Head>
    <CongressComponent {...props} />
  </>;
};

export default congreso;
