import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { experiencesRepository } from '@/src/infrastructure/repositories/experience.repository';
import InscriptionComponent from '@/src/Components/Experience/Inscription/InscriptionComponent';

type ExperienceInscriptionPageProps = {
  price: string;
  limit: string;
  title: string;
  category: string;
  experienceId: number;
  terminos?: string;
};

const ExperienceInscriptionPage = (props: ExperienceInscriptionPageProps) => {
  const { price, limit, title, category, experienceId, terminos } = props;

  return (
    <>
      <Head>
        <title>Inscripción a {title}</title>
      </Head>
      <InscriptionComponent price={price} limit={limit} isCongress={category === 'congreso'} experienceId={experienceId} terminos={terminos} category={category}/>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const experienceResponse = await experiencesRepository.getExperienceBySlug(slug);
    const experience = experienceResponse.data[0].attributes;

    if (!experience) {
      return { notFound: true };
    }
    const experienceId = experienceResponse.data[0].id;

    if (experience.habilitar_inscripcion === false) {
      return { notFound: true };
    }

    if (experience.Estado === 'Finalizado') {
      return {
        notFound: true,
      };
    }

    if (experience.vendido) {
      return {
        notFound: true,
      };
    }
    if (!experience.categoria || experience.categoria === 'no inscripción') { return { notFound: true } }

    type InscriptionCount = { data: { id: number; count: number } };
    const inscriptionCountData = await experiencesRepository.getInscriptionsCount() as InscriptionCount[];
    const inscriptionCount = inscriptionCountData.find((inscription) => inscription.data.id === experienceId)?.data.count ?? 0;
    if (inscriptionCount >= experience.max_inscritos) {
      return {
        notFound: true,
      };
    }

    if (experience.Fecha === null || experience.Precio === null) {
      return {
        notFound: true,
      };
    }

    let limit = '';
    if (experience.deshabilitar_por_sexo === 'Femenino') {
      limit = 'F';
    } else if (experience.deshabilitar_por_sexo === 'Masculino') {
      limit = 'M';
    }

    const price = experience.Precio.toString() ?? '0';

    if ((experience.categoria === 'paga' || experience.categoria === 'congreso' ) && (price === '0' || !price)) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        price,
        limit,
        title: experience.Titulo,
        category: experience.categoria,
        experienceId,
        terminos: experience.terminos || null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default ExperienceInscriptionPage;