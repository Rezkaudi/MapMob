import { TestBed } from '@angular/core/testing';
import { CountTiles } from './count-tiles';

describe('CountTiles', () => {
  it('draws one grey tile per count, in the order given so RTL puts the first on the right', () => {
    const fixture = TestBed.createComponent(CountTiles);
    fixture.componentRef.setInput('tiles', [
      { label: 'إجمالي العروض منذ الانضمام', count: 3 },
      { label: 'العروض النشطة', count: 2 },
      { label: 'العروض المنتهية', count: 0 },
    ]);
    fixture.detectChanges();

    const tiles = [...fixture.nativeElement.querySelectorAll('[data-role="count-tile"]')].map(
      (tile: Element) => [
        tile.querySelector('[data-role="count"]')?.textContent?.trim(),
        tile.querySelector('[data-role="label"]')?.textContent?.trim(),
      ],
    );

    expect(tiles).toEqual([
      ['3', 'إجمالي العروض منذ الانضمام'],
      ['2', 'العروض النشطة'],
      ['0', 'العروض المنتهية'],
    ]);
  });
});
