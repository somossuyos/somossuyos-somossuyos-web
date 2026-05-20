import AnalyticsSpaTracking from '@/src/Components/Analytics/AnalyticsSpaTracking';
import Layout from '@/src/Components/Layout/Layout';
import AppProvider from '@/src/redux/AppProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import localFont from 'next/font/local';

const darkTwenty = localFont({
  src: './../src/Fonts/Dark Twenty.otf',
  variable: '--font-dark-twenty',
});

const futura = localFont({
  src: [
    {
      path: './../src/Fonts/Futura Light font.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './../src/Fonts/Futura Light Italic font.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './../src/Fonts/Futura Book font.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './../src/Fonts/Futura Book Italic font.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './../src/Fonts/futura medium bt.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './../src/Fonts/Futura Medium Italic font.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './../src/Fonts/Futura Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './../src/Fonts/Futura Bold Italic font.ttf',
      weight: '700',
      style: 'italic',
    }
  ],
  variable: '--font-futura',
});

const stretchPro = localFont({
  src: './../src/Fonts/StretchPro.otf',
  variable: '--font-stretch-pro',
});

const productSans = localFont({
  src: [
    {
      path: './../src/Fonts/Product Sans Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './../src/Fonts/Product Sans Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './../src/Fonts/Product Sans Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './../src/Fonts/Product Sans Bold Italic.ttf',
      weight: '700',
      style: 'italic',
    }
  ],
  variable: '--font-product-sans',
});

export default function App({ Component, pageProps }: AppProps) {
  return <AppProvider>
    <AnalyticsSpaTracking />
    <div
      className={`${darkTwenty.variable} ${futura.variable} ${stretchPro.variable} ${productSans.variable}`}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  </AppProvider>;
}