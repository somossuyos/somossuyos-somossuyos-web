import React from 'react';
import Marquee from 'react-fast-marquee';
// import CourseLink from './CourseLink';
import VideoSource from './VideoSource';
import BlogSection from './BlogSection';
import Book from './Book';
import { ResourcesPageProps } from '@/pages/recursos';

type ResourcesComponentProps = ResourcesPageProps;

const ResourcesComponent = ({ videos, books, blog, blogCategories }: ResourcesComponentProps) => {
  return (
    <div className='min-h-screen pt-[150px] xl:pt-[200px] 2xl:pt-[300px] pb-[50px] sm:pb-[200px]'>
      <h1 className='ml-[20px] sm:ml-[150px] font-stretch-pro text-[35px] sm:text-[50px] xl:text-[70px] 2xl:text-[80px] leading-none sm:leading-[70px] relative z-10'>Recursos</h1>
      <Marquee className='-mt-[100px] sm:-mt-[180px] xl:-mt-[280px] 2xl:-mt-[320px] relative z-0'>
        <p className='font-stretch-pro text-border text-[200px] sm:text-[250px] xl:text-[350px] 2xl:text-[400px] h-[250px] sm:h-[350px] xl:h-[450px] 2xl:h-[500px] text-black overflow-hidden'>Recursos</p>
      </Marquee>
      {/* {
        courses.length > 0 && (
          <div className='flex flex-col sm:flex-row items-center justify-center gap-8 xl:gap-[100px]'>
            <h2 className='text-[33px] sm:text-[50px] xl:text-[70px] 2xl:text-[90px] font-dark-twenty text-pale-skin leading-[28px] sm:leading-none 2xl:leading-[70px] self-start ml-4'>
              Puedes <br />
              <span className='font-stretch-pro text-white text-[23px] sm:text-[30px] xl:text-[40px] 2xl:text-[60px] inline-block sm:ml-8'>
                Formarte <br /> en:
              </span>
            </h2>
            <div className='flex flex-wrap items-center justify-center gap-8 sm:gap-[20px] xl:gap-[50px]'>
              {
                courses.map((course, index) => (
                  <CourseLink
                    key={`course-${index}-${course.alt}`}
                    link={course.url ?? '/'}
                    src={course.thumbnail ?? '/'}
                    alt={`Curso de ${course.title}`}
                  />
                ))
              }
            </div>
          </div>
        )
      } */}
      {
        videos.length > 0 && <>
          <h2 className='text-[80px] xl:text-[100px] 2xl:text-[120px] font-dark-twenty text-pale-skin ml-4 sm:ml-[10%] xl:ml-[150px] 2xl:ml-[200px]'>
            Videos
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[50px] px-8 sm:px-[75px] xl:px-[150px] 2xl:px-[200px] pt-4 sm:pt-[50px]'>
            {
              videos.map((video, index) => (
                <VideoSource
                  key={`video-${index}-${video.title}`}
                  title={video.title}
                  subtitle={video.subtitle}
                  link={video.link}
                  thumbnail={video.thumbnail}
                />
              ))
            }
          </div>
        </>
      }
      <BlogSection articles={blog} categories={blogCategories} />
      <div className='px-4 sm:px-[100px] xl:px-[150px] 2xl:px-[200px] mt-[80px]'>
        <h2 className='font-stretch-pro text-[30px] lg:text-[65px]'>Libros</h2>
        <div className='grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[40px] w-full place-items-center sm:gap-[80px] mt-10'>
          {books.map((book, index) => (
            <Book
              key={`book-${index}-${book.title}`}
              title={book.title}
              author={book.author}
              src={book.thumbnail}
              link={book.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesComponent;