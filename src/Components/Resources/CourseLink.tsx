import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type CourseLinkProps = {
  link: string;
  src: string;
  alt: string;
};

const CourseLink = ({link, src, alt}: CourseLinkProps) => {
  return (
    <Link href={link} className='w-[280px] sm:w-[200px] xl:w-[230px] 2xl:w-[280px] h-[280px] sm:h-[200px] xl:h-[230px] 2xl:h-[280px] rounded-[30px] sm:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out'>
      <Image
        src={src}
        alt={alt}
        width={280}
        height={280}
        className='object-cover'
      />
    </Link>
  );
};

export default CourseLink;