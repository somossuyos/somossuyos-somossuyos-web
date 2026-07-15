import type { CheckoutItem } from '@/src/infrastructure/DTOs/Checkout/CheckoutDTO';

/** ID interno del producto (sin Strapi). Default sugerido: 20260719. */
export const DEFAULT_RENASER_RECORDING_PRODUCT_ID = 20260719;

/** Portada local en `public/images/`. El `?v=` evita caché de `next/image` al reemplazar el archivo. */
export const RENASER_RECORDING_COVER_VERSION = '2';
export const RENASER_RECORDING_COVER_PATH = `/images/renaser-2026-video-cover.png?v=${RENASER_RECORDING_COVER_VERSION}`;

export const RENASER_RECORDING_TITLE = 'Grabación Congreso RenaSER 2026';

/** Precio por defecto en COP si no hay variable de entorno. */
export const DEFAULT_RENASER_RECORDING_PRICE = 200000;

/** PayPal.me base (mismo patrón que donaciones); el monto se añade según el precio. */
const RENASER_PAYPAL_ME_BASE = 'https://www.paypal.me/mariapaldana';

/** URL pública de acceso (página estable, no el archivo de video). */
export const RENASER_RECORDING_ACCESS_URL =
  process.env.RENASER_RECORDING_ACCESS_URL?.trim() ||
  'https://www.somossuyos.com/acceso/renaser-2026';

/** Prefijo en la referencia Wompi para identificar compras de la grabación RenaSER. */
export const RENASER_WOMPI_REFERENCE_MARKER = 'r26';

export function getRenaserRecordingProductId(): number {
  const raw = process.env.RENASER_RECORDING_PRODUCT_ID?.trim();
  if (!raw) return DEFAULT_RENASER_RECORDING_PRODUCT_ID;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_RENASER_RECORDING_PRODUCT_ID;
}

export function getRenaserRecordingPrice(): number {
  const raw = process.env.NEXT_PUBLIC_RENASER_RECORDING_PRICE?.trim();
  if (!raw) return DEFAULT_RENASER_RECORDING_PRICE;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_RENASER_RECORDING_PRICE;
}

export function getRenaserRecordingPaypalUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_RENASER_RECORDING_PAYPAL_URL?.trim();
  if (url) return url;

  const price = getRenaserRecordingPrice();
  if (price > 0) return `${RENASER_PAYPAL_ME_BASE}/${price}COP`;

  return undefined;
}

/** Ítem para Redux `addItem` — reutiliza flujo digital `type: book` / `pedido.libro`. */
export function buildRenaserRecordingCartItem() {
  return {
    id: getRenaserRecordingProductId(),
    thumbnail: RENASER_RECORDING_COVER_PATH,
    title: RENASER_RECORDING_TITLE,
    type: 'book' as const,
    price: getRenaserRecordingPrice(),
    quantity: 1,
    category: 'Video digital',
    url: RENASER_RECORDING_ACCESS_URL,
  };
}

export function isRenaserRecordingCheckoutItem(item: CheckoutItem): boolean {
  const targetId = String(getRenaserRecordingProductId());
  if (item.type !== 'pedido.libro') return false;
  if (item.book == null) return false;
  return String(item.book) === targetId;
}

export function isRenaserRecordingOrder(items: CheckoutItem[] | undefined): boolean {
  if (!items?.length) return false;
  return items.some(isRenaserRecordingCheckoutItem);
}

export function isRenaserRecordingReference(reference: string | undefined): boolean {
  if (!reference?.trim()) return false;
  return reference.includes(`-${RENASER_WOMPI_REFERENCE_MARKER}-`);
}
