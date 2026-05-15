import ExperienceComponent, { ExperienceComponentData, ExperienceComponentProps, RelatedExperience } from '@/src/Components/Experience/ExperienceComponent';
import { experienceDataTransform } from '@/src/infrastructure/dataTransformers/ExperienceDataTransformer';
import { experiencesDataTransform } from '@/src/infrastructure/dataTransformers/ExperiencesDataTransformer';
import { InscriptionCountDTO } from '@/src/infrastructure/DTOs/Experiences/InscriptionCountDTO';
import { experiencesRepository } from '@/src/infrastructure/repositories/experience.repository';
import { experienceDayOfMonth, experienceMonthLabel } from '@/src/utils/experienceDisplayDates';
import { formatHours } from '@/src/utils/formatDates';
import { formatPrice } from '@/src/utils/formatPrice';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const slug = ctx.params?.slug;
  const rawData = await experiencesRepository.getExperienceBySlug(slug as string);
  const experienceRaw = rawData.data[0].attributes;

  if (!experienceRaw) {
    return { notFound: true };
  }
  const experienceData = experienceDataTransform({...experienceRaw, id:rawData.data[0].id});

  if (experienceData === null) {
    return { notFound: true };
  }

  if (experienceData.status === 'Finalizado') { return { notFound: true } }
  if (!experienceData.category) { return { notFound: true } }
  if ((experienceData.category === 'paga' || experienceData.category === 'congreso') && (experienceData.price === 0 || !experienceData.price)) { return { notFound: true } }
  if (experienceData.maxRegistrationDate && new Date() > new Date(experienceData.maxRegistrationDate)) {
    return { notFound: true };
  }

  const month = experienceMonthLabel(experienceData.id, experienceData.date);
  const date = experienceDayOfMonth(experienceData.id, experienceData.date);
  const hour = experienceData.time ? formatHours(experienceData.time) : '';
  const inscriptionCountData = await experiencesRepository.getInscriptionsCount() as InscriptionCountDTO[];
  const inscriptionCount = inscriptionCountData.find((inscription) => inscription.data.id === experienceData.id)?.data.count ?? 0;
  const isFreeCategory = experienceData.category === 'no paga';
  const experience: ExperienceComponentData = {
    slug: experienceData.slug || '',
    thumbnail: experienceData.thumbnail.data.attributes.url || '',
    title: experienceData.title || '',
    month,
    link: experienceData.link  || '',
    description: experienceData.description || '',
    type: experienceData.type?.toLowerCase() || '',
    theme: experienceData.theme || '',
    header: {
      firstPart: experienceData.header?.titles?.[0]?.content || '',
      secondPart: experienceData.header?.titles?.[1]?.content || ''
    },
    activity: experienceData.activity,
    inscriptionLimit: isFreeCategory ? false : (inscriptionCount > (experienceData.maxRegistrants || 0)),
    canInscribe: experienceData.registrationEnabled ?? false,
    date,
    hour,
    price: formatPrice(experienceData.price || 0),
    isDateSet: experienceData.date !== null,
    isPriceSet: experienceData.price !== null,
    soldOut: experienceData.sold || false,
    category: experienceData.category ?? null,
    enableDonations: experienceData.donationsEnabled ?? false,
    extras: experienceData.additional ?? '',
    exposers: experienceData.speakers,
    book: experienceData.bookResource ?? null,
    mosaicImage: experienceData.mosaic?.data?.attributes?.url || ''
  };

  const rawRelatedData = await experiencesRepository.getRelatedExperiences(experienceData.slug);
  const experiences = experiencesDataTransform(rawRelatedData) ||[];
  const relatedExperiencesData = experiences.filter((exp) => exp.registrationEnabled);
  const relatedExperiences:RelatedExperience[] = relatedExperiencesData.map((exp) => ({
    id: exp.id,
    thumbnail: exp.thumbnail || '',
    title: exp.title,
    month: experienceMonthLabel(exp.id, exp.date),
    path: `/eventos/${exp.slug}`,
    isDateSet: exp.date !== null,
    soldOut: exp.sold
  }));

  return {
    props: {
      experience,
      relatedExperiences
    },
  };
};

export type ExperiencePageProps = ExperienceComponentProps

const experience = ({ experience, relatedExperiences }: ExperiencePageProps) => {
  const { title } = experience;

  return <>
    <Head>
      <title>{title}</title>
    </Head>
    <ExperienceComponent experience={experience} relatedExperiences={relatedExperiences} />
  </>;
};

export default experience;


