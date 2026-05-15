import CheckOutComponent from '@/src/Components/CheckOut/CheckOutComponent';
import Head from 'next/head';
import React from 'react';

const checkout = () => {
  return <>
    <Head>
      <title>Pago</title>
    </Head>
    <CheckOutComponent />
  </>;
};

export default checkout;