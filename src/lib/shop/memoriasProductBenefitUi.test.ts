import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MemoriasPurchaseTierSection from '@/src/Components/ShopItem/MemoriasPurchaseTierSection';
import {
  MEMORIAS_ATTENDEE_BENEFIT_LABEL,
  MEMORIAS_ATTENDEE_REGULAR_PRICE_LABEL,
  MEMORIAS_ATTENDEE_TOTAL_LABEL,
} from './memoriasPurchaseCopy';
import { buildMemoriasCartItemForAttendee, buildMemoriasCartItemForTier } from './memoriasGeneralCheckout';

describe('Memorias product benefit UI', () => {
  it('1. benefit/me ATTENDEE → ficha muestra 150000', () => {
    const html = renderToStaticMarkup(
      React.createElement(MemoriasPurchaseTierSection, {
        comingSoon: false,
        attendeeBenefitActive: true,
        onGeneralPurchase: () => undefined,
      }),
    );
    assert.match(html, new RegExp(MEMORIAS_ATTENDEE_REGULAR_PRICE_LABEL));
    assert.match(html, new RegExp(MEMORIAS_ATTENDEE_BENEFIT_LABEL));
    assert.match(html, new RegExp(MEMORIAS_ATTENDEE_TOTAL_LABEL));
    assert.match(html, /250\.?000|250000/);
    assert.match(html, /100\.?000|100000/);
    assert.match(html, /150\.?000|150000/);
  });

  it('2. benefit/me PUBLIC → ficha muestra 250000', () => {
    const html = renderToStaticMarkup(
      React.createElement(MemoriasPurchaseTierSection, {
        comingSoon: false,
        attendeeBenefitActive: false,
        onGeneralPurchase: () => undefined,
      }),
    );
    assert.match(html, /Precio/);
    assert.match(html, /250\.?000|250000/);
    assert.doesNotMatch(html, new RegExp(MEMORIAS_ATTENDEE_BENEFIT_LABEL));
  });

  it('3. query hint alone no otorga ATTENDEE en hook', () => {
    const hookSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/customHooks/useRenaserBenefitCart.ts'),
      'utf8',
    );
    assert.doesNotMatch(hookSrc, /renaserBeneficio/);
    assert.match(hookSrc, /credentials:\s*['"]same-origin['"]/);
  });

  it('4. detail pasa attendeeBenefitActive desde API hook', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/Components/ShopItem/MemoriasCongresoProductDetail.tsx'),
      'utf8',
    );
    assert.match(src, /attendeeBenefitActive=\{!benefitLoading && benefitActive\}/);
  });

  it('5–6. carrito ATTENDEE vs PUBLIC item price', () => {
    const att = buildMemoriasCartItemForAttendee();
    const pub = buildMemoriasCartItemForTier('GENERAL');
    assert.ok(att && pub);
    assert.equal(att.price, 150000);
    assert.equal(pub.price, 250000);
  });
});
