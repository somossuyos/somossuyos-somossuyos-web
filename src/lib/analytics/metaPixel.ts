/** Meta (Facebook) Pixel — ID de producción Somos Suyos */
export const META_PIXEL_ID = '1612215813202403';

export const META_PIXEL_NOSCRIPT_IMAGE_SRC =
  `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`;

/**
 * Snippet oficial Meta Pixel (sin etiquetas <script>).
 * @see https://developers.facebook.com/docs/meta-pixel/get-started
 */
export function getMetaPixelInlineScript(pixelId: string = META_PIXEL_ID): string {
  return `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
  `.trim();
}
