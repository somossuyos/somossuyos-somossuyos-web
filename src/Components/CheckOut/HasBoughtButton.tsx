import Link from 'next/link';
import React from 'react';

type ErrorButtonProps = {
  error: string;
}

const ErrorButton = ({ error }: ErrorButtonProps) => {
  return (
    <>
      <p className='text-[12px] py-2 px-10 rounded-full bg-pale-skin mt-5 font-bold'>{error}</p>
      <Link href='/carrito' className='text-[12px] py-2 px-10 rounded-full bg-pale-skin mt-5 font-bold block w-fit'>Volver al carrito</Link>
    </>
  );
};

export default ErrorButton;