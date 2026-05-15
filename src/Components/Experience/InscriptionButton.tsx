import Link from 'next/link';

export type InscriptionButtonProps = {
  slug: string;
  canInscribe: boolean;
  inscriptionLimit: boolean;
  soldOut: boolean;
  category: string
};

const InscriptionButton = (props: InscriptionButtonProps) => {
  const {canInscribe, inscriptionLimit, soldOut } =props;

  const getInscriptionPath = () => {
    return `/eventos/${props.slug}/inscripcion`;
  };


  const buttonClassName = 'inline-block w-fit sm:w-full rounded-[28px] sm:rounded-r-[0px] border-2 px-5 sm:px-10 py-3 sm:py-5 bg-black border-pale-skin h-fit sm:mt-[50px] xl:mt-[100px] sm:border-r-transparent font-stretch-pro sm:text-[20px] xl:text-[26px] 2xl:text-[32px] leading-none 2xl:leading-[34px] text-pale-skin sm:ml-4';

  if (inscriptionLimit || soldOut) {
    return (
      <p className={buttonClassName}>
        Sold out
      </p>
    );
  }

  if (!canInscribe) {
    return (
      <p className={buttonClassName}>
        Inscripciones próximamente
      </p>
    );
  }

  return (
    <Link
      href={getInscriptionPath()}
      className={buttonClassName}
    >
      Inscríbete
    </Link>
  );
};

export default InscriptionButton;