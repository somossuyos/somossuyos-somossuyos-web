import { useEffect, useState } from 'react';
import Image from 'next/image';
import ExperienceHeader from './ExperienceHeader';
import ExperienceThumbnail from './ExperienceThumbnail';
import ExperienceContent from './ExperienceContent';
import ExperienceSidebar from './ExperienceSidebar';
import ExperienceExposers from './ExperienceExposers';
import ExperienceExtras from './ExperienceExtras';
import ExperienceRelated from './ExperienceRelated';
import { ActivityDto, SpeakerDto } from '@/src/infrastructure/DTOs/Experiences';
import { BookDTO } from '@/src/infrastructure/DTOs/Books';
import { Media, MediaData } from '@/src/entities/types/SharedTypes';

export type ExperienceComponentData = {
  slug:string
  thumbnail: string;
  title: string;
  month: string;
  link?: string;
  description: string;
  type: string;
  theme: string;
  header: {
    firstPart: string;
    secondPart: string;
  };
  activity: ActivityDto | null
  inscriptionLimit: boolean;
  canInscribe: boolean;
  date: number;
  hour: string;
  price: string;
  isDateSet: boolean;
  isPriceSet: boolean;
  soldOut: boolean;
  category: string;
  enableDonations: boolean;
  inscriptionLimitDate?: string;
  extras?: string;
  exposers?: SpeakerDto[]
  book: MediaData<BookDTO> | null
  mosaicImage?: string;
};

export type RelatedExperience = {
  id: number;
  thumbnail?: MediaData<Media>;
  title: string;
  month: string;
  path: string;
  isDateSet: boolean;
  soldOut: boolean;
};

export type ExperienceComponentProps = {
  experience: ExperienceComponentData;
  relatedExperiences: RelatedExperience[];
};

const useExperienceData = (experience: ExperienceComponentData) => {
  const {
    slug,
    type,
    isDateSet,
    month,
    header,
    inscriptionLimit,
    canInscribe,
    soldOut,
    enableDonations,
    book,
    category,
    link,
    thumbnail,
    title,
    date,
    hour,
    description,
    activity,
    price,
    isPriceSet,
    exposers,
    extras,
    mosaicImage
  } = experience;

  return {
    slug,
    type,
    isDateSet,
    month,
    header,
    inscriptionLimit,
    canInscribe,
    soldOut,
    enableDonations,
    book,
    category,
    link,
    thumbnail,
    title,
    date,
    hour,
    description,
    activity,
    price,
    isPriceSet,
    exposers,
    extras,
    mosaicImage
  };
};

const ExperienceMosaic = ({ mosaicImage }: { mosaicImage?: string }) =>
  mosaicImage ? (
    <div className="w-full relative mt-[100px] xl:mt-[200px]">
      <div className="w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw]">
        <Image
          src={mosaicImage}
          alt="Mosaico de experiencia"
          width={1920}
          height={600}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
    </div>
  ) : null;

const ExperienceLayout = ({ experienceData, hasLoaded, relatedExperiences }: {
  experienceData: ReturnType<typeof useExperienceData>;
  hasLoaded: boolean;
  relatedExperiences: RelatedExperience[];
}) => (
  <div className="pt-[150px] xl:pt-[250px] relative w-full overflow-hidden">
    <ExperienceHeader
      type={experienceData.type}
      month={experienceData.month}
      isDateSet={experienceData.isDateSet}
      header={experienceData.header}
    />
    <div className="flex flex-col md:flex-row px-8 sm:pr-0 sm:pl-[40px] xl:pl-[100px] 2xl:pl-[160px] gap-4 sm:gap-8 xl:gap-[50px] mt-[50px] sm:mt-[100px] xl:mt-[150px] 2xl:mt-[200px] relative z-10">
      <ExperienceThumbnail
        thumbnail={experienceData.thumbnail}
        title={experienceData.title}
        inscriptionLimit={experienceData.inscriptionLimit}
        canInscribe={experienceData.canInscribe}
        soldOut={experienceData.soldOut}
        slug={experienceData.slug}
        enableDonations={experienceData.enableDonations}
        book={experienceData.book}
        category={experienceData.category}
        link={experienceData.link}
      />
      <ExperienceContent
        title={experienceData.title}
        description={experienceData.description}
        activity={experienceData.activity}
        month={experienceData.month}
        date={experienceData.date}
        hour={experienceData.hour}
        isDateSet={experienceData.isDateSet}
        isPriceSet={experienceData.isPriceSet}
        price={experienceData.price}
        canInscribe={experienceData.canInscribe}
        inscriptionLimit={experienceData.inscriptionLimit}
        soldOut={experienceData.soldOut}
        hasLoaded={hasLoaded}
      />
      <ExperienceSidebar
        activity={experienceData.activity}
        soldOut={experienceData.soldOut}
        canInscribe={experienceData.canInscribe}
        slug={experienceData.slug}
        inscriptionLimit={experienceData.inscriptionLimit}
        enableDonations={experienceData.enableDonations}
        book={experienceData.book}
        category={experienceData.category}
        link={experienceData.link}
        title={experienceData.title}
      />
    </div>
    <ExperienceExposers exposers={experienceData.exposers} />
    <ExperienceExtras extras={experienceData.extras} />
    <ExperienceMosaic mosaicImage={experienceData.mosaicImage} />
    <ExperienceRelated
      relatedExperiences={relatedExperiences}
      soldOut={experienceData.soldOut}
    />
  </div>
);

const ExperienceComponent = ({
  relatedExperiences,
  experience
}: ExperienceComponentProps) => {
  const experienceData = useExperienceData(experience);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  return (
    <ExperienceLayout
      experienceData={experienceData}
      hasLoaded={hasLoaded}
      relatedExperiences={relatedExperiences}
    />
  );
};

export default ExperienceComponent;
