import InscriptionButton, { InscriptionButtonProps } from './InscriptionButton';
import Link from 'next/link';
import useBuyCourseButton from '@/src/customHooks/useBuyCourseButton';
import CustomDonationModal from './Inscription/CustomDonationModal';
import { MediaData } from '@/src/entities/types/SharedTypes';
import { BookDTO } from '@/src/infrastructure/DTOs/Books';

type InscriptionSectionButtonProps = InscriptionButtonProps & {
  enableDonations?: boolean;
  book: MediaData<BookDTO> | null;
  category: string;
  link?: string;
  title: string;
};

// eslint-disable-next-line max-lines-per-function
const InscriptionSectionButton = (props: InscriptionSectionButtonProps) => {
  const {
    soldOut,
    canInscribe,
    slug,
    inscriptionLimit,
    enableDonations,
    book,
    category,
    link,
    title
  } = props;
  const { buyCourse, buyBook } = useBuyCourseButton(book);

  if (category === 'no inscripción' && link) {
    return (
      <>
        <a
          className={
            'flex w-full rounded-[28px] sm:rounded-r-[0px] border-2 px-5 sm:px-10 py-3 sm:py-5 bg-black border-pale-skin sm:mt-[50px] xl:mt-[100px] sm:border-r-transparent font-stretch-pro sm:text-[20px] xl:text-[26px] 2xl:text-[32px] leading-none 2xl:leading-[34px] text-pale-skin sm:ml-4'
          }
          target="_blank"
          // href={'https://chat.whatsapp.com/KtFtruwXBaq2qpMGkNeZCZ'}
          href={link}
        >
          Quiero unirme a la consagración
        </a>
        {book && (
          <>
            <Link
              className={
                'flex w-fit sm:w-full rounded-[28px] sm:rounded-r-[0px] border-2 px-5 sm:px-10 py-3 sm:py-5 bg-black border-pale-skin sm:mt-[50px] xl:mt-[100px] sm:border-r-transparent font-stretch-pro sm:text-[20px] xl:text-[26px] 2xl:text-[32px] leading-none 2xl:leading-[34px] text-pale-skin sm:ml-4'
              }
              href={'/carrito'}
              onClick={buyBook}
            >
              Compra el libro digital via Wompi
            </Link>
            {book.data.attributes.paypalLink && (
              <a
                className={
                  'flex w-fit sm:w-full rounded-[28px] sm:rounded-r-[0px] border-2 px-5 sm:px-10 py-3 sm:py-5 bg-black border-pale-skin sm:mt-[50px] xl:mt-[100px] sm:border-r-transparent font-stretch-pro sm:text-[20px] xl:text-[26px] 2xl:text-[32px] leading-none 2xl:leading-[34px] text-pale-skin sm:ml-4'
                }
                href={book.data.attributes.paypalLink}
                target="_blank"
              >
                Compra el libro digital via PayPal
              </a>
            )}
          </>
        )}
        {enableDonations && <CustomDonationModal showButton porpuse={title} />}

      </>
    );
  }

  if (slug) {
    return (
      <>
        <InscriptionButton
          soldOut={soldOut}
          canInscribe={canInscribe}
          slug={slug}
          category={category}
          inscriptionLimit={inscriptionLimit}
        />
        {book && (
          <>
            <Link
              className={
                'flex w-fit sm:w-full rounded-[28px] sm:rounded-r-[0px] border-2 px-5 sm:px-10 py-3 sm:py-5 bg-black border-pale-skin sm:mt-[50px] xl:mt-[100px] sm:border-r-transparent font-stretch-pro sm:text-[20px] xl:text-[26px] 2xl:text-[32px] leading-none 2xl:leading-[34px] text-pale-skin sm:ml-4'
              }
              href={'/carrito'}
              onClick={buyBook}
            >
              Compra el libro digital via Wompi
            </Link>
            {book?.data.attributes.paypalLink && (
              <a
                className={
                  'flex w-fit sm:w-full rounded-[28px] sm:rounded-r-[0px] border-2 px-5 sm:px-10 py-3 sm:py-5 bg-black border-pale-skin sm:mt-[50px] xl:mt-[100px] sm:border-r-transparent font-stretch-pro sm:text-[20px] xl:text-[26px] 2xl:text-[32px] leading-none 2xl:leading-[34px] text-pale-skin sm:ml-4'
                }
                href={book?.data.attributes.paypalLink}
                target="_blank"
              >
                Compra el libro digital via PayPal
              </a>
            )}
          </>
        )}
        {enableDonations && <CustomDonationModal showButton porpuse={title} />}
      </>
    );
  }

  return (
    <Link
      href={'/carrito'}
      onClick={buyCourse}
      className={
        'inline-block w-fit sm:w-full rounded-[28px] sm:rounded-r-[0px] border-2 px-5 sm:px-10 py-3 sm:py-5 bg-black border-pale-skin sm:mt-[50px] xl:mt-[100px] sm:border-r-transparent font-stretch-pro sm:text-[20px] xl:text-[26px] 2xl:text-[32px] leading-none 2xl:leading-[34px] text-pale-skin sm:ml-4'
      }
    >
      Inscríbete
    </Link>
  );
};

export default InscriptionSectionButton;
