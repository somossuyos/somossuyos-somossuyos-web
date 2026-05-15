import Link from 'next/link';
import React, { useState } from 'react';

type NextEventProps = {
  date: string;
  title: string;
  location: string;
  href: string;
  isLast?: boolean;
};

const NextEvent = ({ date, title, location, isLast, href }: NextEventProps) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className='block sm:w-[350px] xl:w-[400px] 2xl:w-[530px] pl-[40px] py-[30px] font-futura text-white hover:bg-pale-skin transition-colors duration-300 ease-in-out'
      onMouseOver={() => { setIsHovered(true) }}
      onMouseLeave={() => { setIsHovered(false) }}
    >
      <p className={`text-[22px] transition-colors duration-300 ease-in-out ${isHovered ? 'text-black' : ''}`}>{date}</p>
      <p className={`w-1/2 font-bold xl:text-[20px] leading-none my-3 transition-colors duration-300 ease-in-out ${isHovered ? 'text-black' : 'text-pale-skin '}`}>{title}</p>
      <p className={`transition-colors duration-300 ease-in-out ${isHovered ? 'text-black' : ''}`}>{location}</p>
      {
        !isLast && (
          <div className='w-full bg-pale-skin h-[1px] mt-4'></div>
        )
      }
    </Link>
  );
};

export default NextEvent;