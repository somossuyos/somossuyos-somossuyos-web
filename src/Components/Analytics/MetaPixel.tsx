import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { META_PIXEL_ID } from '@/src/lib/analytics/metaPixel';

function trackMetaPageView(): void {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}

/**
 * Meta Pixel: carga fbevents.js una vez y registra PageView en navegación cliente.
 * Montar solo en pages/_app.tsx (afterInteractive, sin SSR del script).
 */
export default function MetaPixel() {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeComplete', trackMetaPageView);
    return () => {
      router.events.off('routeChangeComplete', trackMetaPageView);
    };
  }, [router.events]);

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(s)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
        `.trim(),
      }}
    />
  );
}
