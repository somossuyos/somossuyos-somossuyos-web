import Image from 'next/image';
import InscriptionSectionButton from './InscriptionSectionButton';
import { MediaData } from '@/src/entities/types/SharedTypes';
import { BookDTO } from '@/src/infrastructure/DTOs/Books';

interface ExperienceThumbnailProps {
  thumbnail: string;
  title: string;
  inscriptionLimit: boolean;
  canInscribe: boolean;
  soldOut: boolean;
  slug: string;
  enableDonations: boolean;
  book: MediaData<BookDTO> | null;
  category: string;
  link?: string;
}

const ExperienceThumbnail = ({
  thumbnail,
  title,
  inscriptionLimit,
  canInscribe,
  soldOut,
  slug,
  enableDonations,
  book,
  category,
  link
}: ExperienceThumbnailProps) => {
  return (
    <div className="relative self-center md:self-auto w-[95%] md:w-[200px] xl:w-[260px] flex-nowrap flex-shrink-0 flex-grow-0">
      <div className="w-full sm:absolute top-0 sm:-translate-y-1/3 left-0 grid grid-cols-1 z-20 gap-2 sm:hidden">
        <InscriptionSectionButton
          inscriptionLimit={inscriptionLimit}
          canInscribe={canInscribe}
          soldOut={soldOut}
          slug={slug}
          enableDonations={enableDonations}
          book={book}
          category={category}
          link={link}
          title={title}
        />
      </div>
      <Image
        src={thumbnail}
        alt={`Imagen de la experiencia ${title}`}
        width={260}
        height={400}
        className="rounded-[20px] md:rounded-t-full overflow-hidden object-cover w-full md:w-[200px] xl:w-[260px] xl:h-[400px] flex-shrink-0 flex-grow-0 h-fit aspect-square md:aspect-[260/400] border p-2 md:p-0 md:border-0 border-pale-skin"
      />
    </div>
  );
};

export default ExperienceThumbnail;