import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isActiveRenaserEntitlement,
  RENASER_ENTITLEMENT_PRODUCT_ID,
} from './renaserAccessAudit';

describe('isActiveRenaserEntitlement', () => {
  it('accepts ACTIVE renaser-2026', () => {
    assert.equal(
      isActiveRenaserEntitlement({
        status: 'ACTIVE',
        productId: RENASER_ENTITLEMENT_PRODUCT_ID,
      }),
      true,
    );
  });

  it('rejects ACTIVE wrong product', () => {
    assert.equal(
      isActiveRenaserEntitlement({ status: 'ACTIVE', productId: 'other' }),
      false,
    );
  });

  it('rejects missing record', () => {
    assert.equal(isActiveRenaserEntitlement(null), false);
  });

  it('rejects non-ACTIVE status', () => {
    assert.equal(
      isActiveRenaserEntitlement({
        status: 'REVOKED',
        productId: RENASER_ENTITLEMENT_PRODUCT_ID,
      }),
      false,
    );
  });
});
