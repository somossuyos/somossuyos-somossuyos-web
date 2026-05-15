import React from 'react';
import ShopBagSVG from '../SVG/ShopBagSVG';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/src/redux/hooks';

type CheckoutButtonProps = {
  isMobile?: boolean;
}

const CheckoutButton = ({ isMobile }: CheckoutButtonProps) => {

  const { items } = useAppSelector(state => state.cart);

  const router = useRouter();

  if (
    !isMobile &&
    router.pathname !== '/tienda' &&
    router.pathname !== '/tienda/moda/[id]' &&
    router.pathname !== '/tienda/productos/[id]'
  ) { return null }

  return (
    <Link
      href={'/carrito'}
      className={`bg-white rounded-full w-[56px] h-[56px] items-center justify-center xl:shadow-nav relative ${isMobile ? 'flex xl:hidden':'hidden xl:flex'}`}
    >
      <ShopBagSVG className='text-black ' />
      <p className='text-[12px] w-4 text-center h-4 text-black bg-pale-skin rounded-full absolute top-1/2 left-1/2 -translate-x-4'>{items.length}</p>
    </Link>
  );
};

export default CheckoutButton;