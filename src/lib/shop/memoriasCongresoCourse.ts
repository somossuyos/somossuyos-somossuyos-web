import type { ShopItem } from '@/src/entities/ShopItem';
import type { CheckoutItem } from '@/src/infrastructure/DTOs/Checkout/CheckoutDTO';

/** Slug en `/tienda/curso/<slug>`. */
export const DEFAULT_MEMORIAS_CONGRESO_SLUG = 'memorias-en-video-del-congreso';

export const DEFAULT_MEMORIAS_CONGRESO_COURSE_ID = 20260720;

export const DEFAULT_MEMORIAS_CONGRESO_TITLE = 'Memoria congreso RenaSer 2026';

export const DEFAULT_MEMORIAS_CONGRESO_PRICE = 200000;

export const MEMORIAS_CONGRESO_COVER_PATH = '/images/renaser-2026-video-cover.png';

export const MEMORIAS_SINGLE_PURCHASE_MAX_QUANTITY = 1;

const DESCRIPTION =
  'Acceso digital al congreso en video. Si no pudiste asistir de forma presencial, puedes adquirir las memorias en video. Un acceso por compra.';

export function getMemoriasCongresoCourseSlug(): string {
  return process.env.MEMORIAS_CONGRESO_COURSE_SLUG?.trim() || DEFAULT_MEMORIAS_CONGRESO_SLUG;
}

export function getMemoriasCongresoCourseId(): number {
  const raw = process.env.MEMORIAS_CONGRESO_COURSE_ID?.trim();
  if (!raw) return DEFAULT_MEMORIAS_CONGRESO_COURSE_ID;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MEMORIAS_CONGRESO_COURSE_ID;
}

export function getMemoriasCongresoTitle(): string {
  return process.env.NEXT_PUBLIC_MEMORIAS_CONGRESO_TITLE?.trim() || DEFAULT_MEMORIAS_CONGRESO_TITLE;
}

export function getMemoriasCongresoPrice(): number {
  const raw = process.env.NEXT_PUBLIC_MEMORIAS_CONGRESO_PRICE?.trim();
  if (!raw) return DEFAULT_MEMORIAS_CONGRESO_PRICE;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_MEMORIAS_CONGRESO_PRICE;
}

export function isMemoriasCongresoCourseSlug(slug: string | undefined): boolean {
  if (!slug?.trim()) return false;
  return slug.trim() === getMemoriasCongresoCourseSlug();
}

export function isMemoriasCongresoSinglePurchaseItemId(id: string | number): boolean {
  return String(id) === String(getMemoriasCongresoCourseId());
}

export function isMemoriasCongresoCheckoutItem(item: CheckoutItem): boolean {
  if (item.type !== 'pedido.curso') return false;
  if (item.course == null) return false;
  return String(item.course) === String(getMemoriasCongresoCourseId());
}

/** Devuelve mensaje de error si el carrito no cumple un acceso por compra. */
export function getMemoriasCongresoSinglePurchaseCheckoutError(
  items: CheckoutItem[] | undefined,
): string | null {
  if (!items?.length) return null;
  const memoriasItems = items.filter(isMemoriasCongresoCheckoutItem);
  if (memoriasItems.length === 0) return null;

  if (items.length !== 1 || memoriasItems.length !== 1) {
    return 'Las memorias del congreso solo se compran de a uno por pedido.';
  }

  const quantity = memoriasItems[0].quantity ?? 1;
  if (quantity !== MEMORIAS_SINGLE_PURCHASE_MAX_QUANTITY) {
    return 'Solo puedes comprar un acceso por pedido.';
  }

  return null;
}

/** Ítem para la grilla de `/tienda`. */
export function getMemoriasCongresoShopListItem(): ShopItem {
  return {
    id: String(getMemoriasCongresoCourseId()),
    slug: getMemoriasCongresoCourseSlug(),
    title: getMemoriasCongresoTitle(),
    category: {
      name: 'Curso',
      shippingCost: 0,
      slug: 'curso',
    },
    thumbnail: MEMORIAS_CONGRESO_COVER_PATH,
    thumbnailHeight: 280,
    price: getMemoriasCongresoPrice(),
    isNew: true,
    type: 'course',
    genre: '',
    description: DESCRIPTION,
    sku: '',
    quantity: 1,
    images: [MEMORIAS_CONGRESO_COVER_PATH],
    stock: 1,
    color: '',
    size: '',
    purpose: '',
    colors: [],
    sizes: [],
  };
}

/** Props para `/tienda/curso/memorias-en-video-del-congreso`. */
export function buildMemoriasCongresoProductPageItem() {
  const listItem = getMemoriasCongresoShopListItem();
  return {
    ...listItem,
    id: getMemoriasCongresoCourseId(),
    description: DESCRIPTION,
    images: [MEMORIAS_CONGRESO_COVER_PATH],
  };
}
