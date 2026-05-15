import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const NotFoundPage = () => {
  return <>
    <Head>
      <title>Página no encontrada</title>
    </Head>
    <div className='relative w-full min-h-screen flex flex-col items-center justify-center'>
      <p className='font-stretch-pro text-[100px] sm:text-[400px] text-black text-border absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>404</p>
      <h1 className='font-dark-twenty relative z-10 text-[50px] sm:text-[150px] leading-none text-pale-skin'>Esta página</h1>
      <h2 className='font-stretch-pro relative z-10 text-[25px] sm:text-[50px] leading-none text-center'>No existe, en el servidor</h2>
      <Link href={'/'} className='relative z-10 block bg-pale-skin mt-16 text-black sm:text-2xl px-4 py-2 rounded-[10px]'>
        Ir al inicio
      </Link>
    </div>
  </>;
};

export default NotFoundPage;