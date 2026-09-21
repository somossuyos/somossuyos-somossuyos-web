import { useState } from 'react';
import ShopItemCarousel from './ShopItemCarousel';
import { formatPrice } from '@/src/utils/formatPrice';
import ShopItemColorSelector from './ShopItemColorSelector';
import ShopItemSizeSelector from './ShopItemSizeSelector';
import { useAppDispatch } from '@/src/redux/hooks';
import { addItem } from '@/src/redux/features/cartSlice';
import { useRouter } from 'next/router';
import { ItemPageProps } from '@/pages/tienda/[category]/[product]';

type ShopItemComponentProps = ItemPageProps;

// eslint-disable-next-line max-lines-per-function
const ShopItemComponent = (props: ShopItemComponentProps) => {
  const { images, genre, category, title, price, description, colors, sizes, sku, stock, thumbnail, id, type } = props;
  const [selectedColor, setSelectedColor] = useState(colors[0]?.code ?? '');
  const [selectedSize, setSelectedSize] = useState(sizes[0]?.size ?? '');
  const [quantity, setQuantity] = useState(1);
  const [correctlyAdded, setCorrectlyAdded] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const addToQuantity = () => {
    if (quantity >= stock) { return }
    setQuantity(quantity + 1);
  };

  const subtractFromQuantity = () => {
    if (quantity <= 1) { return }
    setQuantity(quantity - 1);
  };

  const showAddToCart = () => {
    setCorrectlyAdded(true);
    setTimeout(() => {
      setCorrectlyAdded(false);
    }, 3000);
  };
  const handleAddToCart = () => {
    const colorName = colors.find((color) => color.code === selectedColor)?.color;

    showAddToCart();

    const itemToAdd = {
      id,
      thumbnail: thumbnail || images[0],
      title,
      type,
      price,
      quantity,
      size: selectedSize,
      color: colorName,
      category: {
        name: category.name,
        shippingCost: category.shippingCost || 0
      }
    };
    dispatch(addItem(itemToAdd));
  };

  const handleBuyNow = () => {
    const colorName = colors.find((color) => color.code === selectedColor)?.color;
    const itemToAdd = {
      id,
      thumbnail: thumbnail || images[0],
      title,
      type,
      price,
      quantity,
      size: selectedSize,
      color: colorName,
      category: {
        name: category.name,
        shippingCost: category.shippingCost || 0
      }
    };
    dispatch(addItem(itemToAdd));
    router.push('/carrito');
  };

  return (
    <div className='bg-white text-black py-[100px] sm:py-[150px] px-4 sm:px-[75px] xl:px-[200px] 2xl:px-[300px]'>
      <p className='text-[#8B8B8B] pb-[30px] capitalize hidden sm:block'>Tienda . {genre} . {category.name} {title}</p>
      <div className='flex flex-col sm:flex-row justify-center gap-[40px] xl:gap-x-[90px]'>
        <ShopItemCarousel images={images} title={title} />
        <div className='pt-5 sm:w-[450px]'>
          <p className='text-[#989898]'>{category.name}</p>
          <h1 className='text-[26px] leading-none font-stretch-pro'>{title}</h1>
          <p className='text-[#989898] text-[36px] my-2 font-light'>{formatPrice(price)}</p>
          <p className='text-[#989898]' dangerouslySetInnerHTML={{ __html: description }}></p>
          {
            colors &&
            colors.length > 0 &&
            <div className='flex items-center justify-center w-fit h-fit mt-[40px]'>
              <p className='w-[120px] font-bold'>Colores</p>
              {
                colors.map((color, i) => (
                  <ShopItemColorSelector
                    key={`shop-item-color-${i}`}
                    {...color}
                    selected={selectedColor}
                    setSelected={setSelectedColor}
                  />
                ))
              }
            </div>
          }
          {
            sizes &&
            sizes.length > 0 &&
            <div className='flex items-center justify-center w-fit h-fit mt-[40px]'>
              <p className='w-[120px] font-bold'>Tallas</p>
              {
                sizes.length === 1 &&
                <p>{sizes[0].size} <span className='italic text-gray-500'>Talla única</span></p>
              }
              {
                sizes &&
                sizes.length > 1 &&
                sizes.map((size, i) => (
                  <ShopItemSizeSelector
                    key={`shop-item-color-${i}`}
                    {...size}
                    selected={selectedSize}
                    setSelected={setSelectedSize}
                  />
                ))
              }
            </div>
          }
          <div className='flex items-center justify-center w-fit h-fit mt-[40px]'>
            <p className='w-[120px] font-bold'>SKU</p>
            <p>{sku}</p>
          </div>
          <div className='w-full h-[1px] bg-[#EBEBEB] mt-[18px] mb-[50px]'></div>
          <div className='flex flex-col sm:flex-row gap-10'>
            <div className='px-[18px] py-2 rounded-full flex gap-6 border border-[#D7D7D7] h-fit w-fit'>
              <button className='text-[#A1A1A1]' onClick={subtractFromQuantity}>-</button>
              <p>{quantity}</p>
              <button className='text-[#A1A1A1]' onClick={addToQuantity}>+</button>
            </div>
          </div>
          <button
            className='w-full py-2 rounded-full bg-pale-skin mt-[40px] font-bold'
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
          <button
            className='w-full py-2 rounded-full bg-pale-skin mt-4 font-bold text-black transition-opacity duration-200 hover:opacity-80 border border-[#D7D7D7]'
            onClick={handleBuyNow}
          >
            Comprar ahora
          </button>
          {
            correctlyAdded &&
            <p className='text-right text-green-500 mt-4'>Añadido al carrito correctamente</p>
          }
        </div>
      </div>
    </div>
  );
};

export default ShopItemComponent;