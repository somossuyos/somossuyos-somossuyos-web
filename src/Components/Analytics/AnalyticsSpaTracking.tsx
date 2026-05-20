import { useEffect } from 'react';
import { useRouter } from 'next/router';

/** PageView / page updates en navegación cliente (Next.js Pages Router). */
export default function AnalyticsSpaTracking() {
  const router = useRouter();

  useEffect(() => {
    const onRouteChange = (url: string) => {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }
      if (typeof window.clarity === 'function') {
        window.clarity('set', 'page', url);
      }
    };

    router.events.on('routeChangeComplete', onRouteChange);
    return () => {
      router.events.off('routeChangeComplete', onRouteChange);
    };
  }, [router.events]);

  return null;
}
