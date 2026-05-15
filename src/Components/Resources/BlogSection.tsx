import React from 'react';
import Experience from '../Homepage/Experiences/Experience';
import { Article } from '@/src/entities/Article';
import useBlogRouter from '@/src/customHooks/useBlogRouter';


type BlogSectionProps = {
  articles: Article[];
  categories: string[];
};

const BlogSection = ({ articles, categories }: BlogSectionProps) => {

  const { selectedCategory, handleClick, handleChange } = useBlogRouter();

  return (
    <div className='px-4 sm:px-[50px] xl:px-[150px] 2xl:px-[200px] relative mt-[100px] pt-[70px]'>
      <div className='absolute top-0 left-0 h-[280px] sm:h-[500px] w-full bg-pale-skin'></div>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 relative z-10'>
        <h2 className='font-stretch-pro text-[65px] text-black'>Blog</h2>
        <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 xl:gap-10'>
          <select
            className='text-black w-full xl:w-[400px] py-2 px-5 rounded-full'
            value={selectedCategory}
            onChange={handleChange}
          >
            <option value={''} hidden>TEMÁTICAS / CATEGORIAS</option>
            {
              categories.map((category, index) => (
                <option key={`category-${index}-${category}`}>{category}</option>
              ))
            }
          </select>
          <button className='font-futura text-black border border-black px-10 rounded-[7px] hidden sm:block' onClick={handleClick}>BUSCAR</button>
        </div>
      </div>
      <div className='flex flex-wrap gap-4 xl:gap-[50px] 2xl:gap-[100px] relative z-10 items-center justify-center mt-[50px]'>
        {
          articles.map((article, index) => (
            <Experience key={`article-${index}-${article.title}`}
              title={article.title}
              src={article.thumbnail}
              path={`/blog/${article.id}`}
              isDateSet
              canInscribe
            />
          ))
        }
      </div>
    </div>
  );
};

export default BlogSection;