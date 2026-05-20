import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { CLARITY_PROJECT_ID } from '@/src/lib/analytics/clarity';

function notifyClarityPageView(url: string): void {
  if (typeof window.clarity === 'function') {
    window.clarity('set', 'page', url);
  }
}

/**
 * Microsoft Clarity: script oficial en todas las páginas (cliente, afterInteractive).
 */
export default function MicrosoftClarity() {
  const router = useRouter();

  useEffect(() => {
    const onRouteChange = (url: string) => notifyClarityPageView(url);
    router.events.on('routeChangeComplete', onRouteChange);
    return () => {
      router.events.off('routeChangeComplete', onRouteChange);
    };
  }, [router.events]);

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
        `.trim(),
      }}
    />
  );
}
