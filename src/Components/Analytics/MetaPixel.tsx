import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { getMetaPixelInlineScript } from '@/src/lib/analytics/metaPixel';

function trackMetaPageView(): void {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}

/**
 * Meta Pixel (ID 1612215813202403).
 * - Carga fbevents.js con el snippet oficial vía next/script (afterInteractive).
 * - PageView extra en navegación SPA (Next.js Pages Router).
 * - Noscript: ver pages/_document.tsx
 *
 * Nota: next/script no puede usarse en _document; por eso va en _app (equivalente al <head> en runtime).
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
        __html: getMetaPixelInlineScript(),
      }}
    />
  );
}
