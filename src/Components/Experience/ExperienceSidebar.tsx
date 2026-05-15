import InscriptionSectionButton from './InscriptionSectionButton';
import { ActivityDto } from '@/src/infrastructure/DTOs/Experiences';
import { MediaData } from '@/src/entities/types/SharedTypes';
import { BookDTO } from '@/src/infrastructure/DTOs/Books';

interface ExperienceSidebarProps {
  activity: ActivityDto | null;
  soldOut: boolean;
  canInscribe: boolean;
  slug: string;
  inscriptionLimit: boolean;
  enableDonations: boolean;
  book: MediaData<BookDTO> | null;
  category: string;
  link?: string;
  title: string;
}

const ExperienceSidebar = ({
  activity,
  soldOut,
  canInscribe,
  slug,
  inscriptionLimit,
  enableDonations,
  book,
  category,
  link,
  title
}: ExperienceSidebarProps) => {
  return (
    <div className="relative w-full">
      {/* Desktop Activity Display */}
      <div className="hidden md:block">
        {activity && (
          <p className="font-bold text-[18px] leading-[20px] border-2 w-fit border-pale-skin pt-20 px-5 xl:px-10 pb-5 rounded-t-full mt-5 mx-4 sm:mx-0 2xl:mx-[50px] text-[#D9D9D9]">
            <span className="text-[50px] 2xl:text-[81px] font-stretch-pro">
              {activity.quantity}
            </span>{' '}
            <br />
            {activity.title.toLocaleUpperCase()}
          </p>
        )}
        {activity && (
          <p className="mx-4 sm:mx-0 2xl:mx-[50px] font-futura font-bold 2xl:text-[21px] leading-none relative mt-2 w-fit text-[#D9D9D9]">
            DURACIÓN <br /> DE LA <br /> EXPERIENCIA
            <span
              className="flex flex-col items-center justify-center leading-none absolute top-0 right-0 font-stretch-pro text-[30px] 2xl:text-[55px] text-center bg-pale-skin text-black rounded-full w-[100px] 2xl:w-[150px] h-[100px] 2xl:h-[150px]"
              style={{
                transform: 'translate(110%, -30%)',
              }}
            >
              {activity.duration?.split(' ')[0] || ''}
              <br />
              <span className="font-futura text-[25px]">
                {activity.duration?.split(' ')[1] || ''}
              </span>
            </span>
          </p>
        )}
      </div>

      {/* Desktop Inscription Button */}
      <div className="w-full hidden sm:block">
        <InscriptionSectionButton
          soldOut={soldOut}
          canInscribe={canInscribe}
          slug={slug}
          inscriptionLimit={inscriptionLimit}
          enableDonations={enableDonations}
          book={book}
          category={category}
          link={link}
          title={title}
        />
      </div>
    </div>
  );
};

export default ExperienceSidebar;