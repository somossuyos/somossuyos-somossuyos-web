import { useState } from 'react';
import LogoFooter from '@/public/img/footer/Logo footer.png';
import Image from 'next/image';
import Link from 'next/link';
import FooterAnim from './FooterAnim';
import { useRouter } from 'next/router';
import DonationsLines from '../Utils/DonationsLines';
import DonationsModal from '../Utils/DonationsModal';

const Footer = () => {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return <>
    {
      (
        router.pathname === '/' ||
        router.pathname === '/nosotros'
      ) ? <FooterAnim /> : null
    }
    {
      router.pathname !== '/' &&
      router.pathname !== '/nosotros' &&
      router.pathname !== '/calendario' &&
      router.pathname !== '/blog' &&
      router.pathname !== '/agendar-conferencia' &&
      router.pathname !== '/contacto' &&
      router.pathname !== '/carrito' &&
      router.pathname !== '/checkout' &&
      router.pathname !== '/eventos/[slug]/inscripcion' &&
      router.pathname !== '/confirmacion-pago' &&
      router.pathname !== '/eventos/congreso' &&
      <DonationsLines />
    }
    {
      isModalOpen && (
        <DonationsModal closeModal={closeModal} />
      )
    }
    <footer className='grid grid-cols-1 xl:grid-cols-2 px-[20px] sm:px-[50px] xl:px-[100px] 2xl:px-[160px] py-[30px] sm:py-[80px] gap-y-[70px] text-pale-skin font-futura '>
      <div className='order-2 xl:order-first'>
        <Image src={LogoFooter} alt='Logo Footer' className='w-[230px] sm:w-[480px]' />
        <p className='text-[20px] sm:ml-[37px] mt-4'>© 2024 · ALL RIGHTS RESERVED</p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-[70px]'>
        <div className='flex flex-col gap-2 sm:text-[20px]'>
          <p className='font-dark-twenty leading-none text-[70px] sm:text-[78px]'>Somos</p>
          <Link href='/nosotros' className='footer-link'>
            NOSOTROS
          </Link>
          <Link href='/eventos' className='footer-link'>
            EVENTOS
          </Link>
          <Link href={'/calendario'} className='footer-link'>
            CALENDARIO
          </Link>
          <Link href='/recursos' className='footer-link'>
            RECURSOS
          </Link>
          {/* <Link href='/tienda' className='footer-link'>
            TIENDA
          </Link> */}
          <button className='footer-link' onClick={openModal}>
            QUIERO DONAR
          </button>
          <Link href='/contacto' className='contact-link'>
            CONTACTO
          </Link>
        </div>
        <div className='flex flex-col gap-2 text-[20px]'>
          <p className='font-dark-twenty leading-none text-[70px] sm:text-[78px]'>Comunidad</p>
          <a href='https://www.instagram.com/somos.sos/' target='_blank' className='footer-link'>INSTAGRAM</a>
          <a href='https://www.youtube.com/@SomosSuyos' target='_blank' className='footer-link'>YOUTUBE</a>
          <a href='https://open.spotify.com/show/1mocQ1i2ej5yYu2GdID0zJ' target='_blank' className='footer-link'>SPOTIFY</a>
          <a href='https://podcasts.apple.com/co/podcast/somos-suyos-podcast-con-mapi-aldana/id1733543137' target='_blank' className='footer-link'>PODCAST</a>
        </div>
      </div>
    </footer>
  </>;
};

export default Footer;