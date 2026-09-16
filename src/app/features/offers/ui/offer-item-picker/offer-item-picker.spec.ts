import { TestBed } from '@angular/core/testing';
import { OfferItem } from '../../models/offer-item';
import { OfferItemPicker } from './offer-item-picker';

const ITEMS: readonly OfferItem[] = [
  { id: 'i1', name: 'شامبو 1', price: 200 },
  { id: 'i2', name: 'عطر 2', price: 1500 },
];

function render(
  options: {
    items?: readonly OfferItem[];
    selectedIds?: readonly string[];
    isLoading?: boolean;
  } = {},
) {
  const fixture = TestBed.createComponent(OfferItemPicker);
  fixture.componentRef.setInput('items', options.items ?? ITEMS);
  fixture.componentRef.setInput('selectedIds', options.selectedIds ?? ['i2']);
  fixture.componentRef.setInput('isLoading', options.isLoading ?? false);
  fixture.detectChanges();
  return fixture;
}

function rowsOf(fixture: ReturnType<typeof render>): HTMLLabelElement[] {
  return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('li label'));
}

describe('OfferItemPicker', () => {
  it('lists each item with its price and ticks the picked ones', () => {
    const rows = rowsOf(render());

    expect(rows.map((row) => row.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'شامبو 1 200 ل.س',
      'عطر 2 1,500 ل.س',
    ]);
    expect(rows.map((row) => (row.querySelector('input') as HTMLInputElement).checked)).toEqual([
      false,
      true,
    ]);
  });

  it('narrows the list as the admin types', () => {
    const fixture = render();
    const search = (fixture.nativeElement as HTMLElement).querySelector(
      'input[type="search"]',
    ) as HTMLInputElement;

    search.value = 'عطر';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(rowsOf(fixture)).toHaveLength(1);
  });

  it('adds and removes a ticked item', () => {
    const fixture = render();
    const changed = vi.fn();
    fixture.componentInstance.selectedIdsChange.subscribe(changed);
    const [first, second] = rowsOf(fixture).map(
      (row) => row.querySelector('input') as HTMLInputElement,
    );

    first.click();
    second.click();

    expect(changed.mock.calls).toEqual([[['i2', 'i1']], [[]]]);
  });

  it('asks for a store first, and says when a store has nothing to pick', () => {
    expect(render({ items: [] }).nativeElement.textContent).toContain('لا توجد منتجات أو خدمات');
    expect(
      render({ items: [], isLoading: true }).nativeElement.querySelector('[aria-busy="true"]'),
    ).toBeTruthy();
  });
});
