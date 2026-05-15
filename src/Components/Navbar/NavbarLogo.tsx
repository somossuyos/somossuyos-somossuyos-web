import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Logo from '@/public/img/home/Logo_Botonera__somossuyos@2x.png';
import { useRouter } from 'next/router';
import Link from 'next/link';

type NavbarLogoProps = {
  isMobile?: boolean;
}

const NavbarLogo = ({ isMobile }: NavbarLogoProps) => {

  const displaceMent = isMobile ? 50 : 250;

  const router = useRouter();
  const [translateY, setTranslateY] = useState(displaceMent);

  useEffect(() => {
    const handleScroll = () => {
      const translateValue = displaceMent - window.scrollY;
      if (translateValue < 0) { setTranslateY(0) }
      else { setTranslateY(translateValue) }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <Link
    href="/"
    className={`${isMobile ? 'xl:hidden' : 'hidden xl:block'} w-[60px] xl:w-[100px] h-[60px] xl:h-[100px] absolute top-1/2 left-1/2 transition-none z-[90]`}
    style={{
      transform: `translate(-50%, calc(-50% + ${router.pathname !== '/' ? '0px' : `${translateY}px`}))`
    }}
  >
    <Image
      src={Logo}
      alt='Logo'
      priority
    />
  </Link>;
};

export default NavbarLogo;