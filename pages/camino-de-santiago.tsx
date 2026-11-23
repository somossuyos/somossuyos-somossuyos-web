import CaminoDeSantiagoComponent from '@/src/Components/CaminoDeSantiago/CaminoDeSantiagoComponent';
import { caminoDeSantiagoContent } from '@/src/lib/caminoDeSantiago/content';
import Head from 'next/head';

const siteOrigin = 'https://www.somossuyos.com';

const CaminoDeSantiagoPage = () => {
  const { seo } = caminoDeSantiagoContent;
  const canonical = `${siteOrigin}${seo.canonicalPath}`;

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${seo.title} | Somos Suyos`} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
      </Head>
      <CaminoDeSantiagoComponent />
    </>
  );
};

export default CaminoDeSantiagoPage;