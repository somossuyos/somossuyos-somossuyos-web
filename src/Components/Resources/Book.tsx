import Image from 'next/image';
import React from 'react';
import TruncatedText from '@/src/Components/Utils/TruncatedText';

type BookProps = {
  title: string;
  author: string;
  link: string;
  src: string;
};

const Book = ({ title, link, src, author }: BookProps) => {
  return (
    <div className='flex w-fit max-w-[300px] sm:w-full gap-4'>
      <a href={link} target='_blank' className='inline-block'>
        <Image
          src={src}
          alt={title}
          width={140}
          height={210}
          className='w-full max-h-[210px] max-w-[140px] min-h-[210px] min-w-[140px] h-auto aspect-[140/210]'
        />
      </a>
      <div className='h-full flex flex-col items-start gap-3 justify-end'>
        <TruncatedText
          text={title}
          maxLines={2}
          className='font-futura text-gold leading-none text-[21px]'
        />
        <p className='font-futura text-[12px] leading-none'>{author}</p>
        <a href={link} target='_blank' className='inline-block p-2 bg-pale-skin text-black font-futura rounded-[10px]'>
          Ver más
        </a>
      </div>
    </div>
  );
};

export default Book;