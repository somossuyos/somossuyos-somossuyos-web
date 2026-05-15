import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { experiencesRepository } from '@/src/infrastructure/repositories/experience.repository';

interface TerminosPageProps {
  title: string;
  terminos: string;
}

const TerminosPage = ({ title, terminos }: TerminosPageProps) => {
  return (
    <>
      <Head>
        <title>Términos y condiciones de {title}</title>
      </Head>
      <main className='pt-[150px] sm:pt-[250px] relative px-[5%] xl:px-[10%] flex flex-col gap-5 xl:gap-10'>
        <h1 className='font-stretch-pro text-[25px] leading-none text-gold'>Términos y condiciones de {title}</h1>
        <div className='prose max-w-none mb-20' dangerouslySetInnerHTML={{ __html: terminos.replace(/\n/g, '<br/>') }} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const experience = await experiencesRepository.getExperienceBySlug(slug);

    if (!experience?.data) {
      return { notFound: true };
    }

    const {terminos} = experience.data[0].attributes;

    // Verificar si no hay términos y condiciones
    if (!terminos || terminos.trim() === '') {
      return { notFound: true };
    }

    return {
      props: {
        title: experience.data[0].attributes.Titulo,
        terminos: terminos,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default TerminosPage;