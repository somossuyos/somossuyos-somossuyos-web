import { GetServerSidePropsContext } from 'next';

const sites = [
  'https://somossuyos.com/',
  'https://somossuyos.com/blog',
  'https://somossuyos.com/calendario',
  'https://somossuyos.com/eventos',
  'https://somossuyos.com/tienda',
  'https://somossuyos.com/agendar-conferencia',
  'https://somossuyos.com/recursos',
  'https://somossuyos.com/nosotros',
  'https://somossuyos.com/contacto'
];

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     ${sites
    .map((site) => {
      return `
       <url>
           <loc>${site}</loc>
       </url>
     `;
    })
    .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {

  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;