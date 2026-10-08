import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MemoriasPurchaseTierSection from '@/src/Components/ShopItem/MemoriasPurchaseTierSection';
import {
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

  it('2. tier section shows single purchase option at public price', () => {
    const html = renderToStaticMarkup(
      React.createElement(MemoriasPurchaseTierSection, {
        comingSoon: false,
        onGeneralPurchase: () => undefined,
      }),
    );
    assert.match(html, new RegExp(MEMORIAS_GENERAL_TITLE));
    assert.match(html, new RegExp(MEMORIAS_GENERAL_CTA));
    assert.match(html, new RegExp(MEMORIAS_PURCHASE_SECTION_TITLE));
    assert.doesNotMatch(html, /Comprar con descuento/i);
    assert.doesNotMatch(html, /Tarifa especial/i);
  });

  it('3–6. required CTA and title appear', () => {
    const html = renderToStaticMarkup(
      React.createElement(MemoriasPurchaseTierSection, {
        comingSoon: false,
        onGeneralPurchase: () => undefined,
      }),
    );
    assert.ok(html.includes('Congreso Internacional RenaSER 2026'));
    assert.ok(html.includes('Comprar acceso'));
  });

  it('7. cart item uses regular server price only', () => {
    const item = buildMemoriasCartItemForTier('GENERAL');
    assert.ok(item);
    assert.equal(item.price, getMemoriasCongresoPrice());
    assert.equal(item.price, 250000);
  });

  it('8. only GENERAL tier is supported client-side', () => {
    assert.equal(getCheckoutPriceCopForTier('GENERAL'), 250000);
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

  it('12. purchase layout wrapper is present', () => {
    const html = renderToStaticMarkup(
      React.createElement(MemoriasPurchaseTierSection, {
        comingSoon: false,
        onGeneralPurchase: () => undefined,
      }),
    );
    assert.ok(html.includes(MEMORIAS_PURCHASE_LAYOUT.tierGridClass.split(' ')[0]));
  });
});
