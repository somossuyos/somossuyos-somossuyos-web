import useCheckout from '@/src/customHooks/useCheckout';
import { formatPrice } from '@/src/utils/formatPrice';
import CartItem from '../ShoppingCart/CartItem';
import ErrorButton from './HasBoughtButton';
import { isCartDigitalOnly } from '@/src/customHooks/useShoppingCart';


type UserInfoSectionProps = {
  data: ReturnType<typeof useCheckout>['data'];
  digitalOnly: boolean;
};
const UserInfoSection = ({ data, digitalOnly }: UserInfoSectionProps) => (
  <>
    <div>
      <p className='opacity-50'>Nombre</p>
      <p className='text-[25px]'>{data.names} {data.lastNames}</p>
    </div>
    <div>
      <p className='opacity-50'>Correo electrónico</p>
      <p className='text-[25px]'>{data.email}</p>
    </div>
    <div>
      <p className='opacity-50'>Teléfono</p>
      <p className='text-[25px]'>{data.phone}</p>
    </div>
    {!digitalOnly && <>
      <div>
        <p className='opacity-50'>Departamento</p>
        <p className='text-[25px]'>{data.direction.state}</p>
      </div>
      <div>
        <p className='opacity-50'>Ciudad</p>
        <p className='text-[25px]'>{data.direction.city.label}</p>
      </div>
      <div>
        <p className='opacity-50'>Dirección</p>
        <p className='text-[25px]'>{data.direction.direction}</p>
      </div>
    </>}
  </>
);

type SummarySectionProps = {
  totalProducts: number;
  totalPrice: number;
  deliveryPrice: number;
  digitalOnly: boolean;
  items: ReturnType<typeof useCheckout>['items'];
};
const SummarySection = ({ totalProducts, totalPrice, deliveryPrice, digitalOnly, items }: SummarySectionProps) => (
  <>
    <div>
      <p className='opacity-50'>Valor productos</p>
      <p className='text-[25px]'>{formatPrice(totalProducts)} COP</p>
    </div>
    {!digitalOnly && items.some(item => item.type !== 'courses' && item.type !== 'book' && item.type !== 'donation') &&
      <div>
        <p className='opacity-50'>Valor envío</p>
        {
          (() => {
            if (deliveryPrice === 0) {
              if (digitalOnly) {
                return <p className='text-[25px]'>0 COP</p>;
              } else {
                return <p className='text-[25px]'>Calculando</p>;
              }
            } else {
              return <p className='text-[25px]'>{formatPrice(deliveryPrice)} COP</p>;
            }
          })()
        }
      </div>
    }
    <div>
      <p className='opacity-50'><b>Total</b></p>
      <p className='text-[25px]'>{formatPrice(totalPrice)} COP</p>
    </div>
  </>
);

type PaymentButtonSectionProps = {
  hasBought: boolean;
  errorText: string;
  detectDisabled: () => boolean;
  handleClick: () => void;
};
const PaymentButtonSection = ({ hasBought, errorText, detectDisabled, handleClick }: PaymentButtonSectionProps) => (
  <>
    {hasBought ? <ErrorButton error={errorText} /> :
      <button
        className='text-[12px] py-2 px-10 rounded-full bg-pale-skin mt-5 font-bold disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={detectDisabled()}
        onClick={handleClick}
      >
        PROCEDER A PAGAR
      </button>
    }
  </>
);

type CartItemsSectionProps = {
  items: ReturnType<typeof useCheckout>['items'];
};
const CartItemsSection = ({ items }: CartItemsSectionProps) => (
  <>
    {items.length > 0 && <>
      <h2>Producto de compra</h2>
      {items.map(item => (
        <CartItem
          key={`cart-item-${item.title}-${item.id}`}
          type={item.type}
          id={item.id}
          image={item.thumbnail}
          title={item.title}
          price={item.price}
          quantity={item.quantity}
        />
      ))}
    </>}
  </>
);

const CheckOutComponent = () => {
  const { items, totalPrice, deliveryPrice, totalProducts, data, handleClick, detectDisabled, hasBought, errorText } = useCheckout();
  const digitalOnly = isCartDigitalOnly(items);
  return (
    <div className='pt-[100px] px-3 sm:pt-[200px] sm:pb-[100px] bg-white text-black'>
      <h1 className='sm:ml-[250px] font-stretch-pro text-[30px] sm:text-[42px]'>Pago</h1>
      <div className='flex flex-col lg:flex-row items- justify-center gap-5 h-fit'>
        <div className='w-full sm:w-[80%] lg:w-[500px] xl:w-[700px]'>
          <div className='grid md:grid-cols-2 gap-6 mb-10'>
            <UserInfoSection data={data} digitalOnly={digitalOnly} />
            <SummarySection totalProducts={totalProducts} totalPrice={totalPrice} deliveryPrice={deliveryPrice} digitalOnly={digitalOnly} items={items} />
          </div>
          <PaymentButtonSection hasBought={hasBought} errorText={errorText} detectDisabled={detectDisabled} handleClick={handleClick} />
        </div>
        <div className='bg-[#E7E7E7] w-[2px]'></div>
        <div className='sm:ml-6 flex flex-col gap-4 pb-10'>
          <CartItemsSection items={items} />
        </div>
      </div>
    </div>
  );
};

export default CheckOutComponent;