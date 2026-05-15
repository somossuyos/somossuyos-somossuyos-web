import { removeItem, updateQuantity } from '@/src/redux/features/cartSlice';
import { useAppDispatch } from '@/src/redux/hooks';
import { useRouter } from 'next/router';

export const useCartItem = (id: string) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleUpdateQuantity = (quantity: number) => {
    if (quantity < 1) { return }
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleDeleteItem = () => {
    dispatch(removeItem({ id }));
  };

  const isCheckoutPage = router.pathname === '/checkout';

  return {
    handleUpdateQuantity,
    handleDeleteItem,
    isCheckoutPage
  };
};