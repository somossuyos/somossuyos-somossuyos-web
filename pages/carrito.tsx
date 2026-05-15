import ShoppingCartComponent from '@/src/Components/ShoppingCart/ShoppingCartComponent';
import Head from 'next/head';
import React from 'react';

const carrito = () => {
  return <>
    <Head>
      <title>Carrito de compra</title>
    </Head>
    <ShoppingCartComponent />
  </>;
};

export default carrito;