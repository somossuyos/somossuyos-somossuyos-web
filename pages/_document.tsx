import { META_PIXEL_NOSCRIPT_IMAGE_SRC } from '@/src/lib/analytics/metaPixel';
import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

// eslint-disable-next-line max-lines-per-function
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <Script
          type="text/javascript"
          src="https://checkout.wompi.co/widget.js"
          strategy='afterInteractive'
        />
        <Script async strategy="afterInteractive" id='GTM-Script0' src="https://www.googletagmanager.com/gtag/js?id=G-22BF2VN7VK"></Script>
        <Script
          id='Google-Tag-Manager'
          strategy='afterInteractive'
        >
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-22BF2VN7VK');

        (function (w, d, s, l, i) {
          w[l] = w[l] || []; w[l].push({
            'gtm.start':
              new Date().getTime(), event: 'gtm.js'
          }); var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
              'https://www.googletagmanager.com/gtag/js?id=' + i + dl; f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'G-22BF2VN7VK');
          `}
        </Script>
        <Script
          id='tagmanager'
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TX8NTRNK');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TX8NTRNK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src={META_PIXEL_NOSCRIPT_IMAGE_SRC}
          />
        </noscript>
      </body>
    </Html>
  );
}
