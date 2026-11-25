import React from 'react';
import { useRouter } from 'next/router';
import {
  getCaminoWhatsAppActionUrl,
  getDefaultSiteWhatsAppUrl,
  isCaminoWhatsAppContext,
} from '@/src/lib/caminoDeSantiago/whatsappLinks';
import WhatsAppSVG from '../SVG/WhatsAppSVG';

const WhatsAppButton = () => {
  const router = useRouter();
  const isCamino = isCaminoWhatsAppContext(router.pathname);
  const href = isCamino ? getCaminoWhatsAppActionUrl() : getDefaultSiteWhatsAppUrl();
  const label = isCamino ? 'Únete al grupo — Camino de Santiago' : 'Escribir a Somos Suyos por WhatsApp';

  return (
    <a
      className="flex items-center justify-center fixed bg-pale-skin bottom-5 md:bottom-10 right-5 md:right-10 hover:cursor-pointer w-10 2xl:w-16 aspect-square rounded-full z-[99]"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      aria-label={label}
      title={label}
    >
      <WhatsAppSVG className="w-6 2xl:w-10 aspect-square" />
    </a>
  );
};

export default WhatsAppButton;