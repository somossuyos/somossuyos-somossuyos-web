import Image from 'next/image';
import ExperienceHeader from '../ExperienceHeader';
import ExperienceThumbnail from '../ExperienceThumbnail';
import ExperienceContent from '../ExperienceContent';
import ExperienceExposers from '../ExperienceExposers';
import ExperienceExtras from '../ExperienceExtras';
import {
  ActivityDto,
  SpeakerDto,
} from '@/src/infrastructure/DTOs/Experiences/ExperienceDTO';

export type FinishedExperienceComponentData = {
  slug: string;
  thumbnail: string;
  title: string;
  month: string;
  description: string;
  type: string;
  theme: string;
  header: {
    firstPart: string;
    secondPart: string;
  };
  activity: ActivityDto | null;
  date: number;
  hour: string;
  isDateSet: boolean;
  exposers?: SpeakerDto[];
  extras?: string;
  mosaicImage?: string;
  movingText?: string;
};

export type FinishedExperienceComponentProps = {
  event: FinishedExperienceComponentData;
};

const useFinishedExperienceData = (event: FinishedExperienceComponentData) => {
  const {
    slug,
    type,
    isDateSet,
    month,
    header,
    thumbnail,
    title,
    date,
    hour,
    description,
    activity,
    exposers,
    extras,
    mosaicImage,
  } = event;

  return {
    slug,
    type,
    isDateSet,
    month,
    header,
    thumbnail,
    title,
    date,
    hour,
    description,
    activity,
    exposers,
    extras,
    mosaicImage,
  };
};

const FinishedEventMosaic = ({ mosaicImage }: { mosaicImage?: string }) =>
  mosaicImage ? (
    <div className="w-full relative mt-[100px] xl:mt-[200px]">
      <div className="w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw]">
        <Image
          src={mosaicImage}
          alt="Mosaico de evento realizado"
          width={1920}
          height={600}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
    </div>
  ) : null;

const FinishedExperienceLayout = ({
  eventData,
}: {
  eventData: ReturnType<typeof useFinishedExperienceData>;
}) => (
  <div className="pt-[150px] xl:pt-[250px] relative w-full overflow-hidden">
    {/* Header Section */}
    <ExperienceHeader
      type={eventData.type}
      month={eventData.month}
      isDateSet={eventData.isDateSet}
      header={eventData.header}
    />
    <div className="flex flex-col md:flex-row px-8 sm:pr-0 sm:pl-[40px] xl:pl-[100px] 2xl:pl-[160px] gap-4 sm:gap-8 xl:gap-[50px] mt-[50px] sm:mt-[100px] xl:mt-[150px] 2xl:mt-[200px] relative z-10">
      {/* Thumbnail */}
      <ExperienceThumbnail
        thumbnail={eventData.thumbnail}
        title={eventData.title}
        inscriptionLimit={false}
        canInscribe={false}
        soldOut={false}
        slug={eventData.slug}
        enableDonations={false}
        book={null}
        category=""
        link={undefined}
      />

      {/* Content */}
      <ExperienceContent
        title={eventData.title}
        description={eventData.description}
        activity={eventData.activity}
        month={eventData.month}
        date={eventData.date}
        hour={eventData.hour}
        isDateSet={eventData.isDateSet}
        isPriceSet={false}
        price=""
        canInscribe={false}
        inscriptionLimit={false}
        soldOut={false}
        hasLoaded={true}
      />
    </div>

    {/* Exposers Section */}
    <ExperienceExposers exposers={eventData.exposers} />

    {/* Extras Section */}
    <ExperienceExtras extras={eventData.extras} />

    {/* Mosaic Section */}
    <FinishedEventMosaic mosaicImage={eventData.mosaicImage} />

    {/* Marquee de "Realizado" */}
    <div className="mt-[100px] xl:mt-[200px]">
      <div className="overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="font-stretch-pro text-border text-[200px] xl:text-[300px] 2xl:text-[400px] text-black pointer-events-none">
            Realizado
          </span>
        </div>
      </div>
    </div>
  </div>
);

const FinishedExperienceComponent = ({ event }: FinishedExperienceComponentProps) => {
  const eventData = useFinishedExperienceData(event);

  return <FinishedExperienceLayout eventData={eventData} />;
};

export default FinishedExperienceComponent;
