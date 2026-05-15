import RelatedExperience from '../Experience/RelatedExperience';
import Experience from '../Homepage/Experiences/Experience';
import BlogPaginator from './BlogPaginator';
import { BlogPageProps } from '@/pages/blog';
import Link from 'next/link';
import useBlogRouter from '@/src/customHooks/useBlogRouter';

type BlogComponentProps = BlogPageProps;

const BlogComponent = ({ articles, blogCategories, pagination }: BlogComponentProps) => {

  const { selectedCategory, handleClick, handleChange, category } = useBlogRouter();

  if (!articles || articles.length === 0) {
    return <div className='flex flex-col gap-10 items-center justify-center min-h-screen px-10'>
      <p className='font-stretch-pro text-gold text-[20px] sm:text-[40px] xl:text-[70px] max-w-[900px] leading-none'>No encontramos artículos publicados</p>
      <Link href='/blog' className='font-futura text-black border bg-pale-skin border-black px-10 rounded-[7px] sm:text-[20px]'>
      Volver al blog principal
      </Link>
    </div>;
  }

  return (
    <div className='pt-[100px] sm:pt-[200px]'>
      <div className='flex flex-col sm:flex-row px-4 sm:px-[50px] xl:px-[150px] 2xl:px-[200px] items-center justify-between relative z-10'>
        <h2 className='font-stretch-pro text-[65px]'>Blog</h2>
        <div className='flex gap-2 sm:gap-10'>
          <select
            className='text-black w-full xl:w-[300px] 2xl:w-[400px] py-2 px-3 sm:px-5 rounded-full'
            value={selectedCategory}
            onChange={handleChange}
          >
            <option value={''} hidden>TEMÁTICAS / CATEGORIAS</option>
            {
              blogCategories.map((category, index) => (
                <option key={`category-${index}-${category}`}>{category}</option>
              ))
            }
          </select>
          <button className='font-futura text-black border bg-pale-skin border-black px-5 sm:px-10 rounded-[7px] hidden sm:block' onClick={handleClick}>BUSCAR</button>
        </div>
      </div>
      <p className='px-4 sm:px-[50px] xl:px-[150px] 2xl:px-[200px] text-pale-skin my-2'>Blog {category.length > 0 ? `/ ${category}` : ''} </p>
      <div className='flex flex-col sm:flex-row w-full relative sm:py-10 px-4 sm:px-16 xl:px-[160px] items-center sm:items-end justify-center mt-[40px] sm:mt-[100px]'>
        <div className='w-full bottom-0 left-0 absolute hidden sm:block bg-pale-skin sm:h-[250px] xl:h-[400px]'></div>
        <div className='flex flex-wrap sm:flex-nowrap items-center justify-center relative z-10 gap-8 xl:gap-[60px] 2xl:gap-[85px]'>
          {articles.map(({ link, slug, title, thumbnail }, i) => {
            if (i > 3) { return null }
            if (slug===null) { return null }
            return <RelatedExperience
              key={`blog-item-${slug}`}
              title={title}
              path={link}
              src={thumbnail}
              isDateSet
            />;
          })}
        </div>
      </div>
      <div className='flex flex-wrap sm:flex-nowrap items-center justify-center relative z-10 gap-8 xl:gap-[60px] my-8 sm:my-10 2xl:gap-[85px]'>
        {articles.map(({ link, slug, title, thumbnail }, i) => {
          if (i < 4) { return null }
          if (slug===null) { return null }
          return <Experience
            key={`blog-item-${slug}`}
            title={title}
            path={link}
            src={thumbnail}
            isDateSet
            canInscribe
          />;
        })}
      </div>
      <BlogPaginator pagination={pagination} />
    </div>
  );
};

export default BlogComponent;