import { useState } from 'react';
import NavLink from './NavLink';
import NavDropDown from './NavDropDown';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/img/home/Logo_Botonera__somossuyos@2x.png';
import NavbarLogo from './NavbarLogo';
import { useRouter } from 'next/router';
import CheckoutButton from './CheckoutButton';
import MoodleButton from './MoodleButton';

// eslint-disable-next-line max-lines-per-function
const Navbar = () => {

  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownMenu, setDropdownMenu] = useState(false);

  const closeMenu = () => (setIsMenuOpen(false), setDropdownMenu(false));

  const menuButtonBackground = () => {
    const isTiendaDynamic = router.pathname.startsWith('/tienda/') && router.pathname.split('/').length === 4;
    return router.pathname === '/tienda' ||
      isTiendaDynamic ||
      router.pathname === '/carrito' ||
      router.pathname === '/checkout' ? 'bg-black' : 'bg-white';
  };

  return <>
    <div className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 xl:hidden py-5 z-[90] bg-gradient-to-b ${router.pathname === '/tienda' ||
      router.pathname === '/carrito' ||
      (router.pathname.startsWith('/tienda/') && router.pathname.split('/').length === 4) ||
      router.pathname === '/checkout' ? 'from-white' : 'from-black'
    } from-80% to-transparent sm:bg-transparent`}>
      <button onClick={() => setIsMenuOpen(true)} className={`w-10 h-10 flex flex-col gap-1 ${router.pathname === '/tienda' ||
        router.pathname === '/carrito' ||
        (router.pathname.startsWith('/tienda/') && router.pathname.split('/').length === 4) ||
        router.pathname === '/checkout' ? 'text-black bg-white' : 'text-white bg-black'
      }`}>
        <div className={`w-6 h-1 ${menuButtonBackground()}`}></div>
        <div className={`w-6 h-1 ${menuButtonBackground()}`}></div>
        <div className={`w-6 h-1 ${menuButtonBackground()}`}></div>
      </button>
      <NavbarLogo isMobile />
      <CheckoutButton isMobile />
    </div>
    <div
      className={`fixed top-0 left-0 xl:pt-10 bg-black h-full xl:h-auto xl:px-[80px] flex xl:gap-6 w-full z-[90] font-medium xl:transform-none transition-all xl:transition-none duration-500 ${isMenuOpen ? 'translate-x-0 sm:bg-opacity-50' : '-translate-x-[100%] bg-opacity-0'} xl:bg-opacity-100`}
    >
      <div className={`absolute top-0 left-0 w-full h-[140px] bg-gradient-to-b ${router.pathname === '/tienda' ||
        (router.pathname.startsWith('/tienda/') && router.pathname.split('/').length === 4) ||
        router.pathname === '/carrito' ||
        router.pathname === '/checkout' ? 'from-white' : 'from-black'
      } from-80% to-transparent hidden lg:block`}></div>
      <nav className='bg-white w-full sm:w-[260px] xl:w-full px-8 py-4 xl:rounded-full flex flex-col xl:flex-row xl:justify-between xl:items-center relative shadow-nav leading-none'>
        <button className='absolute top-8 right-8 text-black' onClick={() => setIsMenuOpen(false)}>X</button>
        <Link
          href={'/'}
          className='w-[100px] h-[100px] hidden sm:block xl:hidden absolute sm:static mb-10 top-4 left-8 pointer-events-none transition-none'
        >
          <Image
            src={Logo}
            alt='Logo'
            priority
          />
        </Link>
        <div className='flex flex-col xl:flex-row items-center sm:items-start justify-center sm:justify-start gap-10 sm:gap-4 mt-10 sm:mt-0'>
          <NavLink label='Inicio' href='/' onClick={closeMenu} />
          <NavLink label='Nosotros' href='/nosotros' onClick={closeMenu} />
          <NavDropDown
            label='Eventos'
            isOpen={dropdownMenu}
            setIsOpen={setDropdownMenu}
            onClick={closeMenu}
            options={[
              // { label: 'En El Noviazgo', href: '/eventos/noviazgo' },
              // { label: 'Para Matrimonios', href: '/eventos/matrimonios' },
              { label: 'Realizados', href: '/eventos/realizados' },
              { label: 'Próximos', href: '/eventos' },
            ]}
          />
          <NavLink label='Calendario' href='/calendario' onClick={closeMenu} />
        </div>
        <div className='flex flex-col xl:flex-row items-center sm:items-start justify-center sm:justify-start gap-10 sm:gap-4 sm:h-full sm:mr-[180px] mt-10 sm:mt-4'>
          <NavLink label='Blog' href='/blog' onClick={closeMenu} />
          <NavLink label='Recursos' href='/recursos' onClick={closeMenu} />
          <NavLink label='Tienda' href='/tienda' onClick={closeMenu} />
        </div>
        <div className='bg-pale-skin sm:absolute right-0 bottom-0 xl:top-0 mt-4 flex items-center sm:items-end justify-center sm:justify-end sm:mt-0 w-full xl:w-[200px] h-[60px] xl:h-full rounded-[20px] sm:rounded-t-[30px] sm:rounded-b-none xl:rounded-tl-none xl:rounded-tr-[28px] xl:rounded-bl-[28px] text-right text-black'>
          <Link
            href='/agendar-conferencia' className='inline-block w-[200px] sm:w-full h-full relative p-2 pr-6'
            onClick={closeMenu}
          >
            <span className='text-[12px] font-futura mt-2 block w-full'>AGENDAR</span>
            <span className='text-[36px] font-dark-twenty absolute bottom-3 right-5'>Conferencia</span>
          </Link>
        </div>
        <NavbarLogo />
      </nav>
      <div className='h-full w-0 sm:w-full xl:w-0' onClick={() => setIsMenuOpen(false)}>
      </div>
      <CheckoutButton />
      <MoodleButton />
    </div>
  </>;
};

export default Navbar;