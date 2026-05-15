import Image from 'next/image';
import Link from 'next/link';
import { useShopItem } from '@/src/customHooks/useShopItem';
import TruncatedText from '@/src/Components/Utils/TruncatedText';

type ClothItemProps = {
  slug: string;
  image: string;
  title: string;
  category: {
    name: string;
    shippingCost: number;
    slug?: string;
  };
  isNew: boolean;
  imageHeight: number;
  price: number;
  link?: string;
};

const ShopItem = ({ slug, image, title, category, isNew, imageHeight, link }: ClothItemProps) => {
  const { isHovered, setIsHovered } = useShopItem();

  return (
    <Link
      href={link ?? `/tienda/${category.slug ?? ''}/${slug}`}
      className='inline-block w-[280px] h-[450px]  relative rounded-b-[20px] transition-shadow duration-500 hover:shadow-nav'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {
        isNew && (
          <p className='absolute top-0 left-0 px-4 py-2 text-[14px] text-white bg-[#F50402]'>Nueva</p>
        )
      }
      <Image
        src={image}
        alt={title}
        width={280}
        height={imageHeight}
        className='w-full object-cover max-h-[250px]'
        style={{
          aspectRatio: `280 / ${imageHeight}`
        }}
      />
      <div className='p-5'>
        <p className='text-[20px] text-[#707070]'>{category.name}</p>
        <TruncatedText
          text={title}
          maxLines={3}
          className='text-[26px] font-bold'
        />
        <button
          className={`px-8 py-1 w-full sm:w-fit bg-pale-skin mt-4 rounded-full transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'sm:opacity-0'}`}
        >Ver</button>
      </div>
    </Link>
  );
};

export default ShopItem;