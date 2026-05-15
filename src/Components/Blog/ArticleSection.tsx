import { Section } from '@/src/entities/Article';
import React from 'react';
import Image from 'next/image';

type ArticleSectionProps = Section;

const ArticleSection = ({ title, image, content }: ArticleSectionProps) => {
  return (
    <>
      <h2 className='text-gold text-[35px] xl:text-[60px] 2xl:text-[71px] font-bold leading-none mt-[80px] mb-10'>{title}</h2>
      {
        image && (
          <Image
            src={image.url}
            width={image.width}
            height={image.height}
            alt='Imagen de blog'
            className='rounded-[15px] sm:rounded-[20px] xl:rounded-[40px] 2xl:rounded-[60px] w-full'
          />
        )
      }
      {
        content && (
          <p className='mt-6 xl:text-[18px] 2xl:text-[21px]' dangerouslySetInnerHTML={{ __html: content }}></p>
        )
      }
    </>
  );
};

export default ArticleSection;