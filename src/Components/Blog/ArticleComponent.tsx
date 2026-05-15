import Image from 'next/image';
import OthersThemes from './OthersThemes';
import { ArticlePageProps } from '@/pages/blog/[slug]';
import ArticleSection from './ArticleSection';
import useBlogRouter from '@/src/customHooks/useBlogRouter';

type ArticleComponentProps = ArticlePageProps;

const ArticleComponent = ({
  theme,
  title,
  categories,
  sections,
  recommended
}: ArticleComponentProps) => {

  const { selectedCategory, handleClick, handleChange } = useBlogRouter();

  return (
    <div className='pt-[150px] sm:pt-[200px]'>
      <div className='flex flex-col sm:flex-row px-4 sm:px-[50px] xl:px-[150px] 2xl:px-[200px] items-center justify-between relative z-10'>
        <h2 className='font-stretch-pro text-[65px]'>Blog</h2>
        <div className='flex gap-2 xl:gap-6 2xl:gap-10'>
          <select
            className='text-black w-full xl:w-[300px] 2xl:w-[400px] py-2 px-3 sm:px-5 rounded-full'
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
          <button className='font-futura text-black border bg-pale-skin border-black px-5 sm:px-10 rounded-[7px] hidden sm:block' onClick={handleClick}>BUSCAR</button>
        </div>
      </div>
      <p className='px-4 sm:px-[50px] xl:px-[150px] 2xl:px-[200px] text-pale-skin my-2'>Blog / {theme} / {title} </p>
      <div className='px-4 sm:px-[50px] xl:px-[150px] 2xl:px-[200px] mt-[100px] text-gray-200'>
        <div className='flex gap-7 flex-col sm:flex-row'>
          {
            sections[0].image && (
              <Image
                src={sections[0].image.url}
                width={sections[0].image.width}
                height={sections[0].image.height}
                alt='Imagen de blog'
                className='rounded-[15px] sm:rounded-[20px] xl:rounded-[40px] 2xl:rounded-[60px] h-fit sm:max-w-[250px] lg:max-w-[400px] xl:max-w-[500px] 2xl:max-w-[600px]'
              />
            )
          }
          <div>
            <h1 className='text-gold text-[35px] xl:text-[60px] 2xl:text-[71px] font-bold leading-none' dangerouslySetInnerHTML={{ __html: sections[0].title }}></h1>
            {
              sections[0].content && (
                <p className='mt-6 xl:text-[18px] 2xl:text-[21px]' dangerouslySetInnerHTML={{ __html: sections[0].content }}></p>
              )
            }
          </div>
        </div>
        {
          sections.slice(1).map((section, i) => (
            <ArticleSection key={`section-${i}`} {...section} />
          ))
        }
      </div>
      <div className='flex flex-col xl:flex-row relative py-10 px-4 xl:px-[100px] 2xl:px-[160px] items-center xl:items-end justify-center mt-[50px] xl:mt-[100px]'>
        <div className='w-full top-0 sm:top-auto sm:bottom-0 left-0 absolute bg-pale-skin sm:h-[400px] 2xl:h-[465px]'></div>
        <h3 className='self-start xl:self-auto sm:ml-[10%] xl:ml-0 text-white xl:text-black relative z-10 sm:text-right xl:mr-[70px] 2xl:mr-[115px] mb-[50px] sm:mb-[100px] xl:mb-[170px] font-stretch-pro text-[35px] xl:text-[60px] 2xl:text-[80px] leading-[30px] sm:leading-[45px]'>Otras <br />
          <span className='text-pale-skin xl:text-black font-dark-twenty text-[60px] xl:text-[80px] 2xl:text-[100px]'>Temáticas</span>
        </h3>
        <div className='flex flex-wrap sm:flex-nowrap items-center justify-center relative z-10 gap-[50px]'>
          {recommended.map(({ link, slug, title, thumbnail }) => {
            return <OthersThemes
              key={`other-experience-${slug}`}
              path={link}
              src={thumbnail}
              title={title}
              isDateSet
            />;
          })}
        </div>
      </div>
    </div>
  );
};

export default ArticleComponent;