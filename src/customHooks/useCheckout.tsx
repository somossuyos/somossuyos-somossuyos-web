import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { checkoutRepository } from '../infrastructure/repositories/checkout.repository';
import { CheckoutResponseDTO } from '../infrastructure/DTOs/Checkout/CheckoutResponseDTO';
import { PaymentResponseDTO } from '../infrastructure/DTOs/Checkout/PaymentResponseDTO';
import { useRouter } from 'next/router';
import { shopItemTypes } from '../utils/shopItemTypes';
import { deliveryPrices } from '../utils/deliveryPrices';
import { countries } from '../utils/countries';
import { isCartDigitalOnly } from './useShoppingCart';
import { getWompiPublicKeyBrowser, getWompiRedirectUrlBrowser } from '@/src/lib/wompi/clientEnv';


// eslint-disable-next-line max-lines-per-function
export default function useCheckout() {
  const { items } = useAppSelector(state => state.cart);
  const checkoutData = useAppSelector(state => state.checkout);
  const [hasBought, setHasBought] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  useEffect(() => {
    setTotalProducts(items.reduce((acc, item) => acc + item.price * item.quantity, 0));
  }, [items]);

  useEffect(() => {
    setTotalPrice(totalProducts + deliveryPrice);
  }, [deliveryPrice, totalProducts]);

  // const getDeliveryPrice = async () => {
  //   const response = await checkoutRepository.getDeliveryQoute(
  //     checkoutData.direction.city.code,
  //     checkoutData.direction.direction,
  //     totalProducts
  //   ) as DeliveryQuoteDTO;

  //   setDeliveryPrice(response.flete);
  //   setDeliveryDays(response.deliveryDays);
  //   setDeliveryCarrier(response.carrier);
  // };

  const getDeliveryPrice = () => {
    if (isCartDigitalOnly(items)) {
      setDeliveryPrice(0);
      return;
    }

    //Requerimiento:  Si hay productos con valor de envío, usar el mayor, pero si la ciudad es Bogotá, el envío es 10,000 COP
    const deliveryPricesArray = items.map(item => {
      if ((item.type === 'books' || item.category?.name === 'Libro') && (!item.category?.shippingCost || item.category?.shippingCost === 0)) {
        return 0;
      }
      if (item.category?.shippingCost && item.category.shippingCost > 0) {
        return item.category.shippingCost;
      }
      return deliveryPrices[item.category?.name as keyof typeof deliveryPrices] ?? 0;
    });
    const maxDeliveryPrice = Math.max(...deliveryPricesArray);
    const normalize = (str: string) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
    const city = checkoutData?.direction?.city?.label || '';
    const normalizedCity = normalize(city);
    const isBogota = normalizedCity.startsWith('bogota');

    if (isBogota && maxDeliveryPrice > 0) {
      setDeliveryPrice(10000);
    } else {
      setDeliveryPrice(maxDeliveryPrice);
    }
  };

  useEffect(() => {
    if (totalPrice > 0) {
      getDeliveryPrice();
    }
  }, [totalPrice]);

  const router = useRouter();

  const handleClick = async () => {
    const data = {
      totalPrice,
      items: items.map(item => ({
        type: shopItemTypes[item.type as keyof typeof shopItemTypes],
        fashion: item.id,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        product: item.id,
        course: item.id,
        book: item.id,
        purpose: item.purpose,
        name: `${checkoutData.names} ${checkoutData.lastNames}`
      })),
      form: {
        names: checkoutData.names,
        lastNames: checkoutData.lastNames,
        email: checkoutData.email,
        phone: checkoutData.phone,
        direction: {
          city: checkoutData.direction.city.label,
          country: checkoutData.direction.country,
          state: checkoutData.direction.state,
          direction: checkoutData.direction.direction,
        },
      },
    };


    const phoneNumberPrefix = isCartDigitalOnly(items) ? '+57' : `+${countries[data.form.direction.country]?.phoneCode || '57'}`;

    try {
      const response = await checkoutRepository.checkout(data) as CheckoutResponseDTO | string;

      if (typeof response === 'string') {
        setErrorText(response);
        throw new Error();
      }

      const { ammount: amountInCents, transactionReference: reference, encodedIntegritySignature: integrity, redirectUrl } = response;

      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents,
        reference,
        publicKey: getWompiPublicKeyBrowser(),
        signature: { integrity },
        redirectUrl: getWompiRedirectUrlBrowser(redirectUrl) || undefined,
        customerData: {
          email: checkoutData.email,
          fullName: `${checkoutData.names} ${checkoutData.lastNames}`,
          phoneNumber: checkoutData.phone,
          phoneNumberPrefix,
        }
      });

      checkout.open((response: PaymentResponseDTO) => {
        router.push(`/confirmacion-pago?id=${response.transaction.id}`);
      });
    } catch (error) {
      setHasBought(true);
    }
  };

  const detectDisabled = () => {
    // Para productos virtuales, siempre habilitado
    if (isCartDigitalOnly(items)) {
      return false;
    }

    // Para productos físicos, verificar que se haya calculado el precio de envío
    // Si deliveryPrice es 0 y no es un carrito digital, podría estar calculando
    if (deliveryPrice === 0 && !isCartDigitalOnly(items)) {
      // Si aún no se ha calculado el precio de envío, deshabilitar temporalmente
      return true;
    }

    return false;
  };

  return {
    items,
    data: checkoutData,
    totalPrice,
    totalProducts,
    deliveryPrice,
    hasBought,
    errorText,
    detectDisabled,
    handleClick
  };
}