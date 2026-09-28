import { TestBed } from '@angular/core/testing';
import { ProductCountTiles } from './product-count-tiles';

describe('ProductCountTiles', () => {
  it('shows total, available and unavailable, total first so RTL puts it on the right', () => {
    const fixture = TestBed.createComponent(ProductCountTiles);
    fixture.componentRef.setInput('counts', { total: 8, available: 5, unavailable: 3 });
    fixture.detectChanges();

    const tiles = [...fixture.nativeElement.querySelectorAll('[data-role="count-tile"]')].map(
      (tile: Element) => [
        tile.querySelector('[data-role="count"]')?.textContent?.trim(),
        tile.querySelector('[data-role="label"]')?.textContent?.trim(),
      ],
    );

    expect(tiles).toEqual([
      ['8', 'إجمالي المنتجات / الخدمات'],
      ['5', 'عناصر متاحة للزبائن (النشطة)'],
      ['3', 'عناصر غير متاحة حالياً'],
    ]);
  });
});
