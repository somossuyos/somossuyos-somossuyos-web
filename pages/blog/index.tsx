import BlogComponent from '@/src/Components/Blog/BlogComponent';
import { Article } from '@/src/entities/Article';
import { MainBlogDTO } from '@/src/infrastructure/DTOs/Blog/MainBlogDTO';
import { BlogCategoriesDTO } from '@/src/infrastructure/DTOs/Resources/BlogCategoriesDTO';
import { Pagination } from '@/src/infrastructure/DTOs/Resources/CoursesDTO';
import { blogRepository } from '@/src/infrastructure/repositories/blog.repository';
import { resourcesRepository } from '@/src/infrastructure/repositories/resources.repository';
import { formatDates } from '@/src/utils/formatDates';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { page = 1, category = '' } = ctx.query;

  const data = await blogRepository.getBlogs(Number(page), String(category)) as MainBlogDTO;
  const articles = data.data?.map(blog => {
    const month = formatDates(blog.attributes.Fecha);
    return {
      id: blog.id,
      slug: blog.attributes.slug,
      title: blog.attributes.Titulo,
      month,
      thumbnail: blog.attributes.Miniatura.data?.attributes.url ?? null,
      link: `/blog/${blog.attributes.slug}`
    };
  }) ?? [];

  const blogCategoriesData = await resourcesRepository.getBlogCategories() as BlogCategoriesDTO;
  const blogCategories = blogCategoriesData.data?.map(category => category.attributes.Nombre) ?? [];

  const { pagination } = data.meta ?? { pagination: { page: 1, pageSize: 8, pageCount: 1, total: 0 } };
  return {
    props: {
      articles,
      pagination,
      blogCategories
    }
  };
};

export type BlogPageProps = {
  articles: Article[];
  pagination: Pagination;
  blogCategories: string[];
};

const index = (props: BlogPageProps) => {
  return <>
    <Head>
      <title>Blog</title>
    </Head>
    <BlogComponent {...props} />
  </>;
};

export default index;