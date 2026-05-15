import Image from 'next/image';
import HandImage from '@/public/img/home/mano_parallax.png';
import { ActivityDto } from '@/src/infrastructure/DTOs/Experiences';

interface MobileActivityDisplayProps {
  activity: ActivityDto;
  hasLoaded: boolean;
}

interface ExperienceContentProps {
  title: string;
  description: string;
  activity: ActivityDto | null;
  month: string;
  date: number;
  hour: string;
  isDateSet: boolean;
  isPriceSet: boolean;
  price: string;
  canInscribe: boolean;
  inscriptionLimit: boolean;
  soldOut: boolean;
  hasLoaded: boolean;
}

const MobileActivityDisplay = ({ activity, hasLoaded }: MobileActivityDisplayProps) => (
  <div className="md:hidden my-6 relative w-full ml-4">
    <Image
      src={HandImage}
      alt="Mano animada"
      className="absolute top-0 -right-4 sm:right-0 z-10 w-[150px] 2xl:w-[15%] aspect-[981/746]"
      id="hand-home"
      style={{
        transform: `translate(${!hasLoaded ? '100%' : '0%'}, ${
          !hasLoaded ? '-100%' : '0%'
        })`,
        transition: 'transform 1s ease-out',
      }}
    />
    {activity.quantity && activity.duration && (
      <p className="font-bold text-[18px] leading-[20px] border-2 w-fit border-pale-skin pt-20 px-5 xl:px-10 pb-5 rounded-t-full mt-5 mx-4 sm:mx-0 2xl:mx-[50px]">
        <span className="text-[50px] 2xl:text-[81px] font-stretch-pro">
          {activity.quantity}
        </span>{' '}
        <br />
        {activity.title.toLocaleUpperCase()}
      </p>
    )}

    <p className="mx-4 sm:mx-0 2xl:mx-[50px] font-futura font-bold 2xl:text-[21px] leading-none relative mt-2 w-fit">
      DURACIÓN <br /> DE LA <br /> EXPERIENCIA
      <span
        className="flex flex-col items-center justify-center leading-none absolute top-0 right-0 font-stretch-pro text-[30px] 2xl:text-[55px] text-center bg-pale-skin text-black rounded-full w-[100px] 2xl:w-[150px] h-[100px] 2xl:h-[150px]"
        style={{
          transform: 'translate(110%, -30%)',
        }}
      >
        {activity.duration?.split(' ')[0]}
        <br />
        <span className="font-futura text-[25px]">
          {activity.duration?.split(' ')[1]}
        </span>
      </span>
    </p>
  </div>
);


type ExperienceHeaderProps = {
  title: string;
  activity: ActivityDto | null;
  month: string;
  date: number;
  hour: string;
  isDateSet: boolean;
};
const ExperienceHeader = ({ title, activity, month, date, hour, isDateSet }: ExperienceHeaderProps) => (
  <>
    <p className="leading-[30px] font-futura h-full md:hidden">
      <span className="px-5 py-1 mb-2 rounded-full border border-pale-skin">
        {isDateSet ? `EN ${month}` : 'PRÓXIMAMENTE'}
      </span>{' '}
      <br />
      {activity && (
        <>
          <span className="text-[30px] xl:text-[50px] font-stretch-pro">
            {activity.title}
          </span>
          <span className="font-dark-twenty text-pale-skin text-[50px] xl:text-[100px] inline-block -translate-y-3 xl:-translate-y-6">
            {activity.duration?.split(' ')[1]}
          </span>
        </>
      )}
    </p>
    <p className="hidden sm:block">
      {isDateSet ? `${month} ${date} a las ${hour}` : 'Próximamente'}
    </p>
    <h1 className="font-stretch-pro text-[20px] xl:text-[32px] leading-none text-gold hidden sm:block">
      {title}
    </h1>
  </>
);

type ExperienceDescriptionProps = { description: string };
const ExperienceDescription = ({ description }: ExperienceDescriptionProps) => (
  <div
    className="my-4 w-full"
    dangerouslySetInnerHTML={{ __html: description }}
  ></div>
);

type ActivityDetailProps = { activity: ActivityDto; };
const ActivityDetail = ({ activity }: ActivityDetailProps) => (
  <>
    <h2 className="font-stretch-pro text-[20px] xl:text-[32px] text-gold text-nowrap">
      {activity.title}
    </h2>
    {activity.subactivities?.map((subactivity, i) => (
      <p key={`subactivity-${i}`}>{subactivity.name}</p>
    ))}
  </>
);

type PriceSectionProps = {
  canInscribe: boolean;
  inscriptionLimit: boolean;
  soldOut: boolean;
  price: string;
  isPriceSet: boolean;
};
const PriceSection = ({ canInscribe, inscriptionLimit, soldOut, price, isPriceSet }: PriceSectionProps) => (
  <>
    {canInscribe && !inscriptionLimit && !soldOut && Number(price) === 0 && (
      <>
        <h2 className="font-stretch-pro text-[20px] xl:text-[32px] text-gold text-nowrap mt-10">
          Valor Inscripción
        </h2>
        <p className="">
          {isPriceSet ? `${price} pesos colombianos` : 'Próximamente'}
        </p>
      </>
    )}
  </>
);

const ExperienceContent = ({
  title,
  description,
  activity,
  month,
  date,
  hour,
  isDateSet,
  isPriceSet,
  price,
  canInscribe,
  inscriptionLimit,
  soldOut,
  hasLoaded
}: ExperienceContentProps) => {
  return (
    <div className="font-futura w-full max-w-[700px] xl:text-[21px] text-[#D9D9D9] flex flex-col">
      <ExperienceHeader title={title} activity={activity} month={month} date={date} hour={hour} isDateSet={isDateSet} />
      <ExperienceDescription description={description} />
      {activity && <MobileActivityDisplay activity={activity} hasLoaded={hasLoaded} />}
      {activity && <ActivityDetail activity={activity} />}
      <PriceSection canInscribe={canInscribe} inscriptionLimit={inscriptionLimit} soldOut={soldOut} price={price} isPriceSet={isPriceSet} />
    </div>
  );
};

export default ExperienceContent;