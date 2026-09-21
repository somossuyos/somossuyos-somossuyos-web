import type { CheckoutItem } from '@/src/infrastructure/DTOs/Checkout/CheckoutDTO';
import {
  getRenaserRecordingProductId,
  isRenaserRecordingCheckoutItem,
} from '@/src/lib/wompi/renaserRecording';
import {
  getRenaserVirtualProductId,
  isRenaserVirtualCheckoutItem,
} from '@/src/lib/wompi/renaserVirtualCongress';

/** Productos RenaSER: una sola unidad por compra (sin cantidades múltiples). */
export function isRenaserSinglePurchaseItemId(id: string | number): boolean {
  const value = String(id);
  return (
    value === String(getRenaserRecordingProductId()) ||
    value === String(getRenaserVirtualProductId())
  );
}

export const RENASER_SINGLE_PURCHASE_MAX_QUANTITY = 1;

function isRenaserSinglePurchaseCheckoutItem(item: CheckoutItem): boolean {
  return isRenaserRecordingCheckoutItem(item) || isRenaserVirtualCheckoutItem(item);
}

/** Devuelve mensaje de error si el carrito no cumple la regla de un acceso por compra. */
export function getRenaserSinglePurchaseCheckoutError(
  items: CheckoutItem[] | undefined,
): string | null {
  if (!items?.length) return null;
  const renaserItems = items.filter(isRenaserSinglePurchaseCheckoutItem);
  if (renaserItems.length === 0) return null;

  if (items.length !== 1 || renaserItems.length !== 1) {
    return 'Los productos RenaSER solo se compran de a uno por pedido.';
  }

  const quantity = renaserItems[0].quantity ?? 1;
  if (quantity !== RENASER_SINGLE_PURCHASE_MAX_QUANTITY) {
    return 'Solo puedes comprar un acceso por pedido.';
  }

  return null;
}
