import { formatPrice } from '@/src/utils/formatPrice';
import Image from 'next/image';
import { useCartItem } from '@/src/customHooks/useCartItem';
import TruncatedText from '@/src/Components/Utils/TruncatedText';

type CartItemProps = {
  id: string;
  image: string;
  title: string;
  price: number;
  quantity: number;
  type: string;
};

const CartItem = ({ image, title, price, quantity, id, type }: CartItemProps) => {
  const { handleUpdateQuantity, handleDeleteItem, isCheckoutPage } = useCartItem(id);

  return (
    <div className='w-[320px] sm:w-[360px] h-fit max-h-[160px] flex gap-4 p-3 items-center shadow-nav rounded-[16px] relative'>
      <Image
        src={image}
        alt={`Imagen de ${title}`}
        width={120}
        height={120}
        className='h-full w-auto aspect-square object-cover'
      />
      {
        !isCheckoutPage &&
        <button
          className='absolute top-2 right-2 w-7 h-7 flex items-center justify-center border border-[#BABABA] text-[#BABABA] rounded-full'
          onClick={handleDeleteItem}
        >
          X
        </button>
      }
      <div className='w-full'>
        <TruncatedText
          text={title}
          maxLines={1}
          className='tex-[12px] sm:text-[16px] leading-none font-stretch-pro'
        />
        <p className='text-[#989898] text-[28px] my-1 sm:text-[30px] leading-[38px] font-light mb-1'>{formatPrice(price)} COP</p>
        {
          !isCheckoutPage &&
          type !== 'courses' &&
          type !== 'book' &&
          type !== 'donation' &&
          <div className='px-4   rounded-full flex gap-2 items-center justify-center border border-[#D7D7D7] h-fit w-fit'>
            <button className='text-[#A1A1A1]' onClick={() => handleUpdateQuantity(quantity - 1)}>-</button>
            <p>{quantity}</p>
            <button className='text-[#A1A1A1]' onClick={() => handleUpdateQuantity(quantity + 1)}>+</button>
          </div>
        }
        {
          isCheckoutPage &&
          <p className='text-[#A1A1A1]'>x{quantity}</p>
        }
      </div>
    </div>
  );
};

export default CartItem;