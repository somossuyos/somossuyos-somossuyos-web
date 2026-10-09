/** Aula entitlement product id (RenaSEREntitlements.productId). */
export const RENASER_ENTITLEMENT_PRODUCT_ID = 'renaser-2026';

export type EntitlementSnapshot = {
  status?: string;
  productId?: string;
} | null;

export function isActiveRenaserEntitlement(record: EntitlementSnapshot): boolean {
  return (
    record?.status === 'ACTIVE' && record.productId === RENASER_ENTITLEMENT_PRODUCT_ID
  );
}
