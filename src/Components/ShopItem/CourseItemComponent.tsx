import { useState } from 'react';
import { formatPrice } from '@/src/utils/formatPrice';
import Link from 'next/link';
import { useAppDispatch } from '@/src/redux/hooks';
import { addItem } from '@/src/redux/features/cartSlice';
import Image from 'next/image';
import { ItemPageProps } from '@/pages/tienda/[category]/[product]';

type ShopItemComponentProps = ItemPageProps;


const CourseItemComponent = ({
  category,
  title,
  price,
  description,
  thumbnail,
  id,
  type,
}: ShopItemComponentProps) => {
  const [correctlyAdded, setCorrectlyAdded] = useState(false);

  const dispatch = useAppDispatch();

  const showAddToCart = () => {
    setCorrectlyAdded(true);
    setTimeout(() => {
      setCorrectlyAdded(false);
    }, 3000);
  };

  const handleAddToCart = () => {
    showAddToCart();

    dispatch(
      addItem({
        id,
        thumbnail,
        title,
        type,
        price,
        quantity: 1,
        category,
      })
    );
  };

  return (
    <div className="bg-white text-black py-[100px] sm:py-[150px] px-4 sm:px-[75px] xl:px-[200px] 2xl:px-[300px]">
      <p className="text-[#8B8B8B] pb-[30px] capitalize hidden sm:block">
        Tienda . {category.name} {title}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-[40px] xl:gap-x-[90px]">
        <Image
          alt={`Imagen de ${title}`}
          src={thumbnail}
          height={470}
          width={500}
          className="w-full sm:w-[350px] xl:w-[500px] aspect-[500/470] block h-fit"
        />
        <div className="pt-5 sm:w-[450px]">
          <p className="text-[#989898]">{category.name}</p>
          <h1 className="text-[26px] leading-none font-stretch-pro">{title}</h1>
          <p className="text-[#989898] text-[36px] my-2 font-light">
            {formatPrice(price)}
          </p>
          <p
            className="text-[#989898]"
            dangerouslySetInnerHTML={{ __html: description }}
          ></p>
          <div className="w-full h-[1px] bg-[#EBEBEB] mt-[18px] mb-[50px]"></div>
          <Link
            href={'/carrito'}
            onClick={handleAddToCart}
            className="text-center py-2 rounded-full bg-pale-skin text-black w-full font-bold block mt-6"
          >
            Comprar
          </Link>
          {correctlyAdded && (
            <p className="text-right text-green-500 mt-4">
              Añadido al carrito correctamente
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseItemComponent;
