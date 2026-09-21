import type { CheckoutItem } from '@/src/infrastructure/DTOs/Checkout/CheckoutDTO';
import { RENASER_RECORDING_COVER_PATH } from '@/src/lib/wompi/renaserRecording';

/** ID interno (sin Strapi). Default: 20260718 (inicio del congreso). */
export const DEFAULT_RENASER_VIRTUAL_PRODUCT_ID = 20260718;

export const RENASER_VIRTUAL_TITLE = 'Congreso RenaSER 2026 — Acceso virtual';

export const DEFAULT_RENASER_VIRTUAL_PRICE = 250000;

/** Marcador Wompi distinto a la grabación (`r26`). */
export const RENASER_VIRTUAL_WOMPI_REFERENCE_MARKER = 'r26v';

export const RENASER_VIRTUAL_ACCESS_URL =
  process.env.RENASER_VIRTUAL_ACCESS_URL?.trim() ||
  'https://www.somossuyos.com/acceso/renaser-2026-virtual';

export function getRenaserVirtualProductId(): number {
  const raw = process.env.RENASER_VIRTUAL_PRODUCT_ID?.trim();
  if (!raw) return DEFAULT_RENASER_VIRTUAL_PRODUCT_ID;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_RENASER_VIRTUAL_PRODUCT_ID;
}

export function getRenaserVirtualPrice(): number {
  const raw = process.env.NEXT_PUBLIC_RENASER_VIRTUAL_PRICE?.trim();
  if (!raw) return DEFAULT_RENASER_VIRTUAL_PRICE;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_RENASER_VIRTUAL_PRICE;
}

export function buildRenaserVirtualCartItem() {
  return {
    id: getRenaserVirtualProductId(),
    thumbnail: RENASER_RECORDING_COVER_PATH,
    title: RENASER_VIRTUAL_TITLE,
    type: 'book' as const,
    price: getRenaserVirtualPrice(),
    quantity: 1,
    category: 'Congreso virtual',
    url: RENASER_VIRTUAL_ACCESS_URL,
  };
}

export function isRenaserVirtualCheckoutItem(item: CheckoutItem): boolean {
  const targetId = String(getRenaserVirtualProductId());
  if (item.type !== 'pedido.libro') return false;
  if (item.book == null) return false;
  return String(item.book) === targetId;
}

export function isRenaserVirtualOrder(items: CheckoutItem[] | undefined): boolean {
  if (!items?.length) return false;
  return items.some(isRenaserVirtualCheckoutItem);
}

export function isRenaserVirtualReference(reference: string | undefined): boolean {
  if (!reference?.trim()) return false;
  return reference.includes(`-${RENASER_VIRTUAL_WOMPI_REFERENCE_MARKER}-`);
}
