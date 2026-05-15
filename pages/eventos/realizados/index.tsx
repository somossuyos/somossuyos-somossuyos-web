import { ExperiencesProps } from '../index';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { experiencesRepository } from '@/src/infrastructure/repositories/experience.repository';
import { formatDates } from '@/src/utils/formatDates';
import FinishedExperiencesComponent from '@/src/Components/Experiences/FinishedExperiencesComponent';

export const getServerSideProps: GetServerSideProps = async () => {

  const rawData = await experiencesRepository.getFinishedExperiences();
  const experiencesData = rawData.data;

  if(!experiencesData){
    return { notFound: true };
  }

  const experiences = experiencesData.map((experience) => {
    const month = formatDates(experience.attributes.Fecha);
    return {
      id: experience.id,
      thumbnail: experience.attributes.Miniatura?.data?.attributes?.url ?? null,
      month,
      path: `/eventos/realizados/${experience.attributes.slug}`,
      title: experience.attributes.Titulo,
      inscriptionLimit: experience.attributes.max_inscritos,
      isDateSet: true,
      canInscribe: true,
    };
  });

  return {
    props: {
      experiences
    }
  };
};

const index = (props: ExperiencesProps) => {
  return <>
    <Head>
      <title>Eventos realizados</title>
    </Head>
    <FinishedExperiencesComponent {...props} />
  </>;
};

export default index;