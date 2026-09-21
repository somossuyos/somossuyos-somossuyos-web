
import ShopItemComponent from '@/src/Components/ShopItem/ShopItemComponent';
import { ShopItem } from '@/src/entities/ShopItem';
import { ShopItemDTO } from '@/src/infrastructure/DTOs/Shop/ShopItemDTO';
import { shopRepository } from '@/src/infrastructure/repositories/shop.repository';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';


type CourseData = {
  id: number;
  attributes: {
    Titulo: string;
    Descripcion?: string;
    Precio: number;
    Miniatura?: {
      data?: {
        attributes: {
          url?: string;
          height?: number;
        }
      }
    };
    slug: string;
  };
};

function buildCourseItem(courseData: CourseData) {
  const course = courseData.attributes;
  return {
    id: courseData.id,
    title: course.Titulo,
    description: course.Descripcion || '',
    price: course.Precio,
    stock: 1,
    sku: '',
    genre: '',
    category: {
      name: 'Curso',
      slug: 'curso',
      shippingCost: 0
    },
    sizes: [],
    colors: [],
    images: [course.Miniatura?.data?.attributes.url],
    thumbnail: course.Miniatura?.data?.attributes.url ?? '',
    type: 'course',
    thumbnailHeight: course.Miniatura?.data?.attributes.height ?? 0,
    isNew: false,
    quantity: 1,
    color: '',
    size: '',
    purpose: '',
    slug: course.slug
  };
}

function buildProductItem(data: ShopItemDTO) {
  const productData = data.data[0]?.attributes;
  return {
    id: data.data[0].id,
    title: productData.Titulo,
    description: productData.Descripcion,
    price: productData.Precio,
    stock: productData.Stock,
    sku: productData.SKU,
    genre: productData.Genero,
    category: {
      name: productData.categoria_productos?.data[0]?.attributes.Nombre ?? '',
      slug: productData.categoria_productos?.data[0]?.attributes.slug ?? '',
      shippingCost: Number(productData.categoria_productos?.data[0]?.attributes.Costo_envio) ?? 0
    },
    sizes: productData.Tallas?.map((size) => ({
      size: size.Nombre,
      available: size.Disponible
    })) ?? [],
    colors: productData.Colores?.map((color) => ({
      color: color.Nombre,
      code: color.codigo ?? '#000',
      avaliable: color.Disponible
    })) ?? [],
    images: productData.Fotos?.data?.map((photo) => photo.attributes.url) ?? [productData.Miniatura?.data?.attributes.url],
    thumbnail: productData.Miniatura?.data?.attributes.url ?? '',
    type: 'product',
    thumbnailHeight: 0,
    isNew: false,
    quantity: 1,
    color: '',
    size: '',
    purpose: '',
    slug: productData.slug ?? ''
  };
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const product = ctx.params?.product as string;
  const category = ctx.params?.category as string;

  if (category === 'curso') {
    const data = await shopRepository.getCourse(product);
    const courseData = data.data && data.data[0];
    if (!courseData) {
      return { notFound: true };
    }
    const item = buildCourseItem(courseData);
    return { props: { ...item } };
  }

  // Si no es curso, buscar como producto
  const data = await shopRepository.getProductBySlug(product) as ShopItemDTO;
  const productData = data.data[0]?.attributes;

  if (!productData) {
    return {
      notFound: true
    };
  }

  const item = buildProductItem(data);
  return {
    props: {
      ...item
    }
  };
};

export type ItemPageProps = ShopItem;

const item = (props: ItemPageProps) => {

  const { title } = props;
  return <>
    <Head>
      <title>{title}</title>
    </Head>
    <ShopItemComponent {...props} />
  </>;
};

export default item;