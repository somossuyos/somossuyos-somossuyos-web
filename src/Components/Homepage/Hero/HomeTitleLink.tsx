import Image, { StaticImageData } from 'next/image';
import React from 'react';

type HomeTitleLinkProps = {
  image: string | StaticImageData;
  ariaLabel: string;
  href: string;
};

const HomeTitleLink = ({ image, href, ariaLabel }: HomeTitleLinkProps) => {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className='hidden sm:block'
      target='_blank'
    >
      <Image
        src={image}
        alt='HomeTitleLink'
        className='w-[30px] h-[30px]'
        priority
      />
    </a>
  );
};

export default HomeTitleLink;