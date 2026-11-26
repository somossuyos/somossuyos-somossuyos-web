import type { ShopItem } from '@/src/entities/ShopItem';

export const CAMINO_BIBLICO_PRODUCT_ID = 'camino-biblico-adviento-2027';
export const CAMINO_BIBLICO_SLUG = 'camino-biblico-de-adviento';
export const CAMINO_BIBLICO_TITLE = 'Camino Bíblico De Adviento 2027';
export const CAMINO_BIBLICO_PRICE_COP = 25_000;
export const CAMINO_BIBLICO_AMOUNT_IN_CENTS = CAMINO_BIBLICO_PRICE_COP * 100;
export const CAMINO_BIBLICO_COVER_PATH = '/images/camino_biblico.jpeg';
export const CAMINO_BIBLICO_REFERENCE_PREFIX = 'ss-camino-biblico-';

export const CAMINO_BIBLICO_WHATSAPP_CHANNEL_URL =
  'https://whatsapp.com/channel/0029Vb8ALbbBfxnxJhSO5Z1u';

export const CAMINO_BIBLICO_PAYPAL_URL = 'https://www.paypal.com/ncp/payment/QRAPXGHLRYTB6';
export const CAMINO_BIBLICO_PAYPAL_USD = 12;
export const CAMINO_BIBLICO_EUR_ES = 12;
export const CAMINO_BIBLICO_BIZUM = '624300628';
export const CAMINO_BIBLICO_BIZUM_CONTACT = 'María Paula Aldana';

export function isCaminoBiblicoOrderReference(reference: string | undefined): boolean {
  return Boolean(reference?.startsWith(CAMINO_BIBLICO_REFERENCE_PREFIX));
}

export function getCaminoBiblicoCourseSlug(): string {
  return process.env.CAMINO_BIBLICO_COURSE_SLUG?.trim() || CAMINO_BIBLICO_SLUG;
}

export function isCaminoBiblicoCourseSlug(slug: string | undefined): boolean {
  if (!slug?.trim()) return false;
  return slug.trim() === getCaminoBiblicoCourseSlug();
}

/** URL del PDF del e-book (S3 o `/ebooks/...` en el mismo sitio). */
export function resolveCaminoBiblicoPdfUrl(): string | null {
  const explicit = process.env.CAMINO_BIBLICO_DIGITAL_PDF_URL?.trim();
  if (explicit) return explicit;
  return null;
}

export function getCaminoBiblicoProductDisplayName(): string {
  return (
    process.env.CAMINO_BIBLICO_DIGITAL_PRODUCT_NAME?.trim() ||
    'E-book Camino Bíblico de Adviento 2027'
  );
}

export function getCaminoBiblicoShopListItem(): ShopItem {
  return {
    id: CAMINO_BIBLICO_PRODUCT_ID,
    slug: getCaminoBiblicoCourseSlug(),
    title: CAMINO_BIBLICO_TITLE,
    category: { name: 'Curso', shippingCost: 0, slug: 'curso' },
    thumbnail: CAMINO_BIBLICO_COVER_PATH,
    thumbnailHeight: 400,
    price: CAMINO_BIBLICO_PRICE_COP,
    isNew: true,
    type: 'course',
    genre: '',
    description: '',
    sku: CAMINO_BIBLICO_PRODUCT_ID,
    quantity: 1,
    images: [CAMINO_BIBLICO_COVER_PATH],
    stock: 1,
    color: '',
    size: '',
    purpose: '',
    colors: [],
    sizes: [],
  };
}

export function buildCaminoBiblicoProductPageItem() {
  const listItem = getCaminoBiblicoShopListItem();
  return {
    ...listItem,
    images: [CAMINO_BIBLICO_COVER_PATH],
  };
}