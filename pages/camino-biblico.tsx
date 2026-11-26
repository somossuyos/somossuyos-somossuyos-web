import Head from 'next/head';
import CaminoBiblicoProductPage from '@/src/Components/CaminoBiblico/CaminoBiblicoProductPage';
import { caminoBiblicoContent } from '@/src/lib/caminoBiblico/content';

export default function CaminoBiblicoPage() {
  const { seo } = caminoBiblicoContent;
  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Head>
      <CaminoBiblicoProductPage />
    </>
  );
}