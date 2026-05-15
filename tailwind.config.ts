import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/Components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/Components/**/**/*.{js,ts,jsx,tsx,mdx}',
    './src/Components/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'dark-twenty': ['var(--font-dark-twenty)'],
        'futura': ['var(--font-futura)'],
        'stretch-pro': ['var(--font-stretch-pro)'],
        'product-sans': ['var(--font-product-sans)'],
      },
      colors: {
        'pale-skin': '#EDDDD5',
        'gold': '#CFC6B1',
        'custom-red': '#F79B9B'
      },
      boxShadow: {
        'nav': '0px 3px 6px #00000029'
      }
    },
  },
  plugins: [],
};
export default config;
