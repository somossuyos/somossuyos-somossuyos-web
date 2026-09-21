import ShopComponent from '@/src/Components/Shop/ShopComponent';
import { ShopItem } from '@/src/entities/ShopItem';
import { ShopItemsDTO } from '@/src/infrastructure/DTOs/Shop/ShopItemsDTO';
import { shopRepository } from '@/src/infrastructure/repositories/shop.repository';
import { GetStaticProps } from 'next';
import Head from 'next/head';

export const getStaticProps: GetStaticProps = async () => {
  const [productsData, coursesData] = await Promise.all([
    shopRepository.getProducts(),
    shopRepository.getCourses()
  ]);

  const productsItems = (productsData as ShopItemsDTO).data?.map(item => {
    const { createdAt } = item.attributes;
    const creationDate = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - creationDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return {
      id: item.id,
      slug: item.attributes.slug,
      title: item.attributes.Titulo,
      category: {
        name: item.attributes.categoria_productos?.data[0]?.attributes.Nombre ?? '',
        slug: item.attributes.categoria_productos?.data[0]?.attributes.slug ?? '',
        shippingCost: Number(item.attributes.categoria_productos?.data[0]?.attributes.Costo_envio) ?? 0
      },
      thumbnail: item.attributes.Miniatura.data.attributes.url,
      thumbnailHeight: item.attributes.Miniatura.data.attributes.height,
      price: item.attributes.Precio,
      isNew: days <= 7,
      type: 'products'
    };
  }) ?? [];

  const courses = coursesData.data?.map(item => {
    const { createdAt } = item.attributes;
    const creationDate = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - creationDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return {
      id: item.id,
      slug: item.attributes.slug,
      title: item.attributes.Titulo,
      category: {
        name: 'Curso',
        shippingCost: 0,
        slug: 'curso'
      },
      thumbnail: item.attributes.Miniatura.data?.attributes.url,
      thumbnailHeight: item.attributes.Miniatura.data?.attributes.height,
      price: item.attributes.Precio,
      isNew: days <= 7,
      type: 'course'
    };
  }) ?? [];

  const items = [...productsItems, ...courses];

  const shopItems = items.sort((a, b) => {
    return a.category.name.localeCompare(b.category.name);
  });

  return {
    props: {
      shopItems
    },
    revalidate: 300
  };
};

export type ShopPageProps = {
  shopItems: ShopItem[];
}


const index = (props: ShopPageProps) => {
  return <>
    <Head>
      <title>Tienda</title>
    </Head>
    <ShopComponent {...props} />
  </>;
};

export default index;