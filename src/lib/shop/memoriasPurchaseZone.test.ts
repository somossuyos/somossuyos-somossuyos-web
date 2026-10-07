import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MemoriasPurchaseTierSection from '@/src/Components/ShopItem/MemoriasPurchaseTierSection';
import MemoriasAttendeeVerificationModal from '@/src/Components/ShopItem/MemoriasAttendeeVerificationModal';
import {
  MEMORIAS_ATTENDEE_CTA,
  MEMORIAS_ATTENDEE_TITLE,
  MEMORIAS_GENERAL_CTA,
  MEMORIAS_GENERAL_TITLE,
  MEMORIAS_PURCHASE_LAYOUT,
  MEMORIAS_PURCHASE_SECTION_TITLE,
  MEMORIAS_REMOVED_AULA_ACCESS_SNIPPETS,
} from './memoriasPurchaseCopy';
import { buildMemoriasCartItemForTier } from './memoriasGeneralCheckout';
import {
  getCheckoutPriceCopForTier,
  getMemoriasRegularPriceCop,
  MEMORIAS_ATTENDEE_PRICE_COP,
} from './memoriasCongresoPricing';
import { getMemoriasCongresoPrice } from './memoriasCongresoCourse';
import { isClientDiscountQueryBypass } from './memoriasGeneralCheckout';

describe('Memorias purchase zone copy', () => {
  it('1. removed aula access text is absent from product detail source', () => {
    const detailPath = path.join(
      process.cwd(),
      'src/Components/ShopItem/MemoriasCongresoProductDetail.tsx',
    );
    const source = fs.readFileSync(detailPath, 'utf8');
    for (const snippet of MEMORIAS_REMOVED_AULA_ACCESS_SNIPPETS) {
      assert.equal(source.includes(snippet), false, `unexpected in detail: ${snippet}`);
    }
  });

  it('2. tier section shows two purchase options', () => {
    const html = renderToStaticMarkup(
      React.createElement(MemoriasPurchaseTierSection, {
        comingSoon: false,
        onGeneralPurchase: () => undefined,
      }),
    );
    assert.match(html, new RegExp(MEMORIAS_ATTENDEE_TITLE));
    assert.match(html, new RegExp(MEMORIAS_GENERAL_TITLE));
    assert.match(html, new RegExp(MEMORIAS_ATTENDEE_CTA));
    assert.match(html, new RegExp(MEMORIAS_GENERAL_CTA));
    assert.match(html, new RegExp(MEMORIAS_PURCHASE_SECTION_TITLE));
  });

  it('3–6. required CTAs and titles appear', () => {
    const html = renderToStaticMarkup(
      React.createElement(MemoriasPurchaseTierSection, {
        comingSoon: false,
        onGeneralPurchase: () => undefined,
      }),
    );
    assert.ok(html.includes('Ya asistí a RenaSER 2026'));
    assert.ok(html.includes('No asistí al Congreso'));
    assert.ok(html.includes('Comprar con descuento'));
    assert.ok(html.includes('Comprar acceso'));
  });

  it('7. general cart item uses regular server price only', () => {
    const item = buildMemoriasCartItemForTier('GENERAL');
    assert.ok(item);
    assert.equal(item.price, getMemoriasCongresoPrice());
    assert.equal(item.price, 250000);
  });

  it('8. attendee tier does not produce a cart item client-side', () => {
    assert.equal(buildMemoriasCartItemForTier('ATTENDEE'), null);
    assert.equal(getCheckoutPriceCopForTier('ATTENDEE'), null);
    assert.equal(MEMORIAS_ATTENDEE_PRICE_COP, 150_000);
  });

  it('9. rejects discount query-param bypass flags', () => {
    assert.equal(isClientDiscountQueryBypass(new URLSearchParams('discount=true')), true);
    assert.equal(isClientDiscountQueryBypass(new URLSearchParams('price=1')), true);
    assert.equal(isClientDiscountQueryBypass(new URLSearchParams('')), false);
  });

  it('10. regular price remains 250000 COP server-side', () => {
    assert.equal(getMemoriasRegularPriceCop(), 250000);
  });

  it('11. generic shop item page still uses ShopItemComponent, not memorias tier section', () => {
    const pagePath = path.join(process.cwd(), 'pages/tienda/[category]/[product].tsx');
    const source = fs.readFileSync(pagePath, 'utf8');
    assert.ok(source.includes('MemoriasCongresoProductDetail'));
    assert.ok(source.includes('ShopItemComponent'));
    assert.match(source, /isMemorias \?/);
  });

  it('12. responsive grid structure is present', () => {
    const html = renderToStaticMarkup(
      React.createElement(MemoriasPurchaseTierSection, {
        comingSoon: false,
        onGeneralPurchase: () => undefined,
      }),
    );
    assert.ok(html.includes(MEMORIAS_PURCHASE_LAYOUT.tierGridClass.split(' ')[0]));
    assert.ok(html.includes('md:grid-cols-2'));
  });

  it('13. verification modal exposes dialog semantics', () => {
    const html = renderToStaticMarkup(
      React.createElement(MemoriasAttendeeVerificationModal, {
        open: true,
        onClose: () => undefined,
        returnFocusRef: { current: null },
      }),
    );
    assert.ok(html.includes('role="dialog"'));
    assert.ok(html.includes('aria-modal="true"'));
    assert.ok(html.includes('Verifica tu asistencia'));
  });
});
