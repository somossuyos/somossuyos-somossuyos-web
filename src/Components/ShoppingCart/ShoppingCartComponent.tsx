import ShoppingCartForm from './ShoppingCartForm';
import CartItem from './CartItem';
import { formatPrice } from '@/src/utils/formatPrice';
import Link from 'next/link';
import useShoppingCart, { isCheckoutFormValid, isInternational, isCartDigitalOnly } from '@/src/customHooks/useShoppingCart';


const ShoppingCartComponent = () => {

  const {
    items,
    totalPrice,
    form,
    setForm,
    handleClick,
  } = useShoppingCart();

  return (
    <div className='pt-[100px] px-3 sm:pt-[200px] sm:pb-[100px] bg-white text-black'>
      <h1 className='sm:ml-[250px] font-stretch-pro text-[30px] sm:text-[42px]'>Carrito de la compra</h1>
      <div className='flex flex-col lg:flex-row items-center justify-center gap-5 h-fit'>
        <ShoppingCartForm
          form={form}
          setForm={setForm}
        />
        <div className='bg-[#E7E7E7] w-[2px]'></div>
        <div className='sm:ml-6 flex flex-col gap-4'>
          {
            items.length > 0 && <>
              <h2>Producto de compra</h2>
              {
                items.map(item => (
                  <CartItem
                    key={`cart-item-${item.title}-${item.id}`}
                    id={item.id}
                    image={item.thumbnail}
                    title={item.title}
                    price={item.price}
                    quantity={item.quantity}
                    type={item.type}
                  />
                ))
              }
            </>
          }
          <div className='m-8'>
            {
              items.length > 0 && <>
                <p className='opacity-50'>Total</p>
                <p className='text-[30px]'>{formatPrice(totalPrice)} COP</p>
                <p className={`${!isCheckoutFormValid(form, items) ? 'text-red-400' : 'opacity-0'} text-[12px] my-2 text-right`}>Tienes que llenar todos los campos</p>
                <button
                  className='text-[12px] py-2 px-10 rounded-full bg-pale-skin mt-5 font-bold disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={items.length === 0 || !isCheckoutFormValid(form, items) || (!isCartDigitalOnly(items) && isInternational(form))}
                  onClick={handleClick}
                >
                  PROCEDER A PAGAR
                </button>
                {!isCartDigitalOnly(items) && isInternational(form) && (
                  <p className='text-red-400 text-[12px] mt-2'>No disponible para envíos internacionales</p>
                )}
              </>
            }
            {
              items.length === 0 && <>
                <p className='text-[20px]'>No hay productos en el carrito</p>
                <Link href={'/tienda'} className='py-1 px-10 rounded-full bg-pale-skin mt-5 font-bold block w-fit'>
                  Volver a la tienda
                </Link>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartComponent;