import ArticleComponent from '@/src/Components/Blog/ArticleComponent';
import { Article } from '@/src/entities/Article';
import { ArticleDTO } from '@/src/infrastructure/DTOs/Blog/ArticleDTO';
import { ArticlesIDSDTO } from '@/src/infrastructure/DTOs/Blog/ArticlesIdsDTO';
import { MainBlogDTO } from '@/src/infrastructure/DTOs/Blog/MainBlogDTO';
import { BlogCategoriesDTO } from '@/src/infrastructure/DTOs/Resources/BlogCategoriesDTO';
import { blogRepository } from '@/src/infrastructure/repositories/blog.repository';
import { resourcesRepository } from '@/src/infrastructure/repositories/resources.repository';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import Head from 'next/head';

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await blogRepository.getArticles() as ArticlesIDSDTO;
  const paths = data.data
    ?.filter(article => typeof article.attributes.slug === 'string')
    .map((article) => ({
      params: { slug: article.attributes.slug }
    })) ?? [];

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  const slug = ctx.params?.slug as string;
  const data = await blogRepository.getArticleBySlug(slug) as ArticleDTO;
  const [blogData] = data.data;

  if (!blogData) {
    return {
      notFound: true,
      revalidate: 60
    };
  }

  const article = {
    id: blogData.id,
    slug: blogData.attributes.slug,
    title: blogData.attributes.Titulo,
    theme: blogData.attributes.Tematica.data?.attributes.Nombre ?? 'Sin categoría',
    sections: blogData.attributes.Seccion?.map((section) => ({
      title: section.Titulo,
      content: section.Contenido ?? null,
      image: section.Media.data ? {
        url: section.Media.data.attributes.url ?? null,
        width: section.Media.data?.attributes.width ?? null,
        height: section.Media.data?.attributes.height ?? null
      } : null
    })) ?? []
  };

  const recommendedArticles = await blogRepository.getRecommendedArticles(slug) as MainBlogDTO;
  const recommended = recommendedArticles.data.map(blog => ({
    id: blog.id,
    slug: blog.attributes.slug,
    title: blog.attributes.Titulo,
    thumbnail: blog.attributes.Miniatura.data?.attributes.url ?? null,
    link: `/blog/${blog.attributes.slug}`
  }));

  const blogCategoriesData = await resourcesRepository.getBlogCategories() as BlogCategoriesDTO;
  const categories = blogCategoriesData.data.map(category => category.attributes.Nombre);

  return {
    props: {
      ...article,
      recommended,
      categories
    },
    revalidate: 300
  };
};

export type ArticlePageProps = Article & {
  recommended: Article[];
  categories: string[];
}

const article = (props: ArticlePageProps) => {
  const { title } = props;
  return <>
    <Head>
      <title>{title}</title>
    </Head>
    <ArticleComponent {...props} />
  </>;
};

export default article;