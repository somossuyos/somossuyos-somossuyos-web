import { str } from './webhookStrings';

/** Nombre completo del comprador desde `transaction` de Wompi. */
export function customerFullNameFromWompiTransaction(
  trx: Record<string, unknown> | undefined,
): string {
  if (!trx) return '';
  const raw = trx.customer_data ?? trx.customerData;
  if (!raw || typeof raw !== 'object') return '';
  const o = raw as Record<string, unknown>;
  return str(o.full_name || o.fullName).trim();
}

/**
 * Nombre del producto si Wompi lo envía (`payment_link.name`, etc.);
 * si no hay, el correo usa WOMPI_DIGITAL_PRODUCT_NAME o el default.
 */
export function productLabelFromWompiTransaction(
  trx: Record<string, unknown> | undefined,
): string | undefined {
  if (!trx) return undefined;
  const pl = trx.payment_link;
  if (pl && typeof pl === 'object') {
    const name = (pl as Record<string, unknown>).name;
    if (typeof name === 'string' && name.trim()) return name.trim();
  }
  const summary = trx.product_summary;
  if (typeof summary === 'string' && summary.trim()) return summary.trim();
  return undefined;
}
