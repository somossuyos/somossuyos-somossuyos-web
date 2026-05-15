import React from 'react';
import ContactComponent from '@/src/Components/Contact/ContactComponent';
import Head from 'next/head';

const contacto = () => {
  return <>
    <Head>
      <title>Contacto</title>
    </Head>
    <ContactComponent />
  </>;
};

export default contacto;