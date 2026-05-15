import ExperiencesComponent from '@/src/Components/Experiences/ExperiencesComponent';
import { experiencesDataTransform } from '@/src/infrastructure/dataTransformers/ExperiencesDataTransformer';
import { InscriptionCountDTO } from '@/src/infrastructure/DTOs/Experiences/InscriptionCountDTO';
import { experiencesRepository } from '@/src/infrastructure/repositories/experience.repository';
import { experienceMonthLabel } from '@/src/utils/experienceDisplayDates';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async () => {
  const rawData = await experiencesRepository.getExperiences();
  const experiencesData = experiencesDataTransform(rawData);
  const inscriptionCountData = await experiencesRepository.getInscriptionsCount() as InscriptionCountDTO[];

  if(!experiencesData){
    return { notFound: true };
  }

  const experiences = experiencesData?.map((experience) => {
    const month = experienceMonthLabel(experience.id, experience.date);
    const inscriptionCount = inscriptionCountData.find((inscription) => inscription.data.id === experience.id)?.data.count ?? 0;
    const inscriptionLimit = experience.maxRegistrants ?? 0;
    const isFreeCategory = experience.category === 'no paga';
    const isSoldOutByLimit = inscriptionLimit > 0 && inscriptionCount >= inscriptionLimit;
    const isSoldFlag = experience.sold ?? false;
    return {
      slug: experience.slug || '',
      thumbnail: experience.thumbnail.data.attributes.url || '',
      month,
      path: `/eventos/${experience.slug || ''}`,
      title: experience.title || '',
      isDateSet: experience.date !== null,
      canInscribe: experience.registrationEnabled ?? false,
      soldOut: isFreeCategory ? isSoldFlag : (isSoldOutByLimit || isSoldFlag),
      type: experience.type || '',
    };
  }) ?? [];

  return {
    props: {
      experiences
    }
  };
};

export type ExperiencesProps = {
  experiences: {
    slug:string;
    thumbnail: string;
    month: string;
    path: string;
    title: string;
    isDateSet: boolean;
    canInscribe: boolean;
    soldOut: boolean;
    type: string;
  }[];
}

const index = (props: ExperiencesProps) => {
  return <>
    <Head>
      <title>Eventos</title>
    </Head>
    <ExperiencesComponent {...props} />
  </>;
};

export default index;