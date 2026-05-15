import ResourcesComponent from '@/src/Components/Resources/ResourcesComponent';
import { Article } from '@/src/entities/Article';
import { Course } from '@/src/entities/Course';
import { Video } from '@/src/entities/Video';
import { BlogCategoriesDTO } from '@/src/infrastructure/DTOs/Resources/BlogCategoriesDTO';
import { BlogDTO } from '@/src/infrastructure/DTOs/Resources/BlogDTO';
import { BooksDTO } from '@/src/infrastructure/DTOs/Resources/BooksDTO';
import { VideosDTO } from '@/src/infrastructure/DTOs/Resources/VideosDTO';
import { resourcesRepository } from '@/src/infrastructure/repositories/resources.repository';
import { formatDates } from '@/src/utils/formatDates';
import { GetStaticProps } from 'next';
import Head from 'next/head';

export const getStaticProps: GetStaticProps = async () => {

  const videosData = (await resourcesRepository.getVideos()) as VideosDTO;
  const videos = videosData.data?.map((video) => ({
    title: video.attributes.Titulo,
    subtitle: video.attributes.Subtitulo,
    link: video.attributes.Link,
    thumbnail: video.attributes.Miniatura.data?.attributes.url,
  })) ?? [];

  const blogData = (await resourcesRepository.getBlog()) as BlogDTO;
  const blog = blogData.data?.map((blog) => {
    const month = formatDates(blog.attributes.Fecha);
    return {
      id: blog.id,
      title: blog.attributes.Titulo,
      month,
      thumbnail: blog.attributes.Miniatura.data?.attributes.url,
      link: `/blog/${blog.id}`,
    };
  }) ?? [];

  const blogCategoriesData =
    (await resourcesRepository.getBlogCategories()) as BlogCategoriesDTO;
  const blogCategories = blogCategoriesData.data?.map(
    (category) => category.attributes.Nombre
  ) ?? [];

  const booksData = (await resourcesRepository.getBooks()) as BooksDTO;
  const books = booksData.data
    ?.filter((book) =>
      book.attributes.Link &&
      !book.attributes.link_paypal &&
      (!book.attributes.Precio || book.attributes.Precio === 0)
    )
    ?.map((book) => ({
      title: book.attributes.Nombre,
      author: book.attributes.Autor,
      thumbnail: book.attributes.Miniatura.data?.attributes.url,
      url: book.attributes.Link,
    })) ?? [];

  return {
    props: {
      videos,
      blog,
      blogCategories,
      books,
    },
    revalidate: 300,
  };
};

export type ResourcesPageProps = {
  courses: Course[];
  videos: Video[];
  blog: Article[];
  blogCategories: string[];
  books: {
    title:string
    author:string
    thumbnail:string
    url:string
  }[];
};

const recursos = (props: ResourcesPageProps) => {
  return (
    <>
      <Head>
        <title>Recursos</title>
        <meta name="description" content="Recursos" />
      </Head>
      <ResourcesComponent {...props} />
    </>
  );
};

export default recursos;
