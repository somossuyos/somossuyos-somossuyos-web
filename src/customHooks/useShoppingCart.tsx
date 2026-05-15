import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { CheckoutData } from '../entities/CheckoutData';
import { emptyCheckoutData } from '../utils/emptyData';
import { setData } from '../redux/features/checkoutSlice';
import { useRouter } from 'next/router';
import { ShopItem } from '../entities/ShopItem';

export default function useShoppingCart() {
  const { items } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [form, setForm] = useState<CheckoutData>(emptyCheckoutData);

  const router = useRouter();

  useEffect(() => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);

  }, [items]);

  const handleClick = () => {
    const data = {

      names: form.names.value,
      lastNames: form.lastNames.value,
      email: form.email.value,
      phone: form.phone.value,
      direction: {
        city: {
          label: form.direction.city.label,
          code: form.direction.city.code,
        },
        country: form.direction.country.value,
        state: form.direction.state.value,
        direction: form.direction.direction.value,
      },
    };
    dispatch(setData(data));
    router.push('/checkout');
  };

  // const handleClick = async () => {
  //   const data = {
  //     totalPrice,
  //     items: items.map(item => ({
  //       type: 'pedido.moda',
  //       fashion: item.id,
  //       quantity: item.quantity,
  //       color: item.color,
  //       size: item.size,
  //     })),
  //     form: {
  //       names: form.names.value,
  //       lastNames: form.lastNames.value,
  //       email: form.email.value,
  //       phone: form.phone.value,
  //       direction: {
  //         city: form.direction.city.label,
  //         country: form.direction.country.value,
  //         state: form.direction.state.value,
  //         direction: form.direction.direction.value,
  //       },
  //     },
  //   };

  //   const response = await checkoutRepository.checkout(data) as CheckoutResponseDTO;
  //   const { ammount: amountInCents, transactionReference: reference, encodedIntegritySignature: integrity } = response;

  //   const checkout = new window.WidgetCheckout({
  //     currency: 'COP',
  //     amountInCents,
  //     reference,
  //     publicKey: process.env.WOMPI_PUBLIC_KEY,
  //     signature: {
  //       integrity
  //     },
  //     redirectUrl: process.env.WOMPI_REDIRECT_URL,
  //     customerData: {
  //       email: data.form.email,
  //       fullName: `${data.form.names} ${data.form.lastNames}`,
  //       phoneNumber: data.form.phone,
  //       phoneNumberPrefix: '+57',
  //     }
  //   });

  //   checkout.open((response: PaymentResponseDTO) => {
  //     router.push(`/confirmacion-pago?id=${response.transaction.id}`);
  //   });
  // };

  return {
    items,
    totalPrice,
    form,
    setForm,
    handleClick
  };
}

export function isCheckoutFormValid(form: CheckoutData, items?: ShopItem[]) {
  if (items && isCartDigitalOnly(items)) {
    return (
      form.names.isValid &&
      form.lastNames.isValid &&
      form.email.isValid &&
      form.phone.isValid
    );
  }

  return (
    form.names.isValid &&
    form.lastNames.isValid &&
    form.email.isValid &&
    form.phone.isValid &&
    form.direction.country.isValid && form.direction.country.value.length > 0 &&
    form.direction.city.label.length > 0 &&
    form.direction.state.isValid && form.direction.state.value.length > 0 &&
    form.direction.direction.isValid && form.direction.direction.value.length > 0
  );
}

export function isInternational(form: CheckoutData) {
  const country = (form.direction.country.value || '').trim().toUpperCase();
  return !!country && country !== 'COLOMBIA';
}

export const DIGITAL_ITEM_TYPES = ['course', 'donation', 'books', 'book'];

export function isCartDigitalOnly(items: ShopItem[]): boolean {
  return items.length > 0 && items.every(item =>
    DIGITAL_ITEM_TYPES.includes(item.type) ||
    (item.type === 'product' && (!item.category?.shippingCost || item.category?.shippingCost === 0)) ||
    (item.category?.name === 'Libro' && (!item.category?.shippingCost || item.category?.shippingCost === 0)) ||
    // Agregar lógica adicional para detectar productos virtuales
    (item.type === 'book') ||
    (item.type === 'courses') ||
    (item.type === 'donation')
  );
}