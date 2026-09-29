import { TestBed } from '@angular/core/testing';
import { buildLinkedStoreRows } from '../../state/linked-store-rows';
import { buildDeliveryPlatform, buildLinkedStore } from '../../testing/delivery-platform-fixture';
import { LinkedStoresDialog } from './linked-stores-dialog';

const ROWS = buildLinkedStoreRows([
  buildLinkedStore(),
  buildLinkedStore({ id: 'place-2', name: 'مقهى الزاوية', area: null }),
]);

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(LinkedStoresDialog);
  fixture.componentRef.setInput('platform', buildDeliveryPlatform());
  fixture.componentRef.setInput('rows', ROWS);
  fixture.componentRef.setInput('categoryOptions', [{ value: 'category-1', label: 'مطاعم' }]);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture;
}

function cellTexts(row: Element): string[] {
  return Array.from(row.querySelectorAll('td'), (cell) => cell.textContent?.trim() ?? '');
}

describe('LinkedStoresDialog', () => {
  it('names the platform in the heading and in the link column', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('المتاجر المرتبطة بمنصة طلبات');
    expect(Array.from(element.querySelectorAll('th'), (cell) => cell.textContent?.trim())).toEqual([
      'اسم المتجر',
      'التصنيف',
      'المحافظة-المنطقة',
      'رابط المتجر في طلبات',
      'تاريخ الربط',
    ]);
  });

  it('opens as the wide frame with no footer', () => {
    const element = render().nativeElement as HTMLElement;

    expect(
      element.querySelector('app-form-dialog-frame [data-role="dialog-card"]')?.classList,
    ).toContain('w-[1051px]');
    expect(element.querySelector('footer')).toBeNull();
  });

  it('fills a row per store', () => {
    const rows = (render().nativeElement as HTMLElement).querySelectorAll('tbody tr');

    expect(rows[0].querySelector('[data-role="store-name"]')?.textContent?.trim()).toBe(
      'مطعم المدينة',
    );
    expect(cellTexts(rows[0]).slice(1)).toEqual([
      'مطاعم',
      'طرطوس - الدريكيش',
      'https://www.talabat.com/city-restaurant',
      '٢٦ يناير ٢٠٢٤',
    ]);
    expect(cellTexts(rows[1])[2]).toBe('طرطوس');
    expect(rows[0].querySelector('a')?.getAttribute('dir')).toBe('ltr');
  });

  it('puts the search on the right and the category on the left, and reports both', () => {
    const fixture = render();
    const searches: string[] = [];
    const categories: (string | null)[] = [];
    fixture.componentInstance.searchChange.subscribe((search) => searches.push(search));
    fixture.componentInstance.categoryChange.subscribe((category) => categories.push(category));
    const toolbar = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-role="linked-stores-toolbar"]',
    ) as HTMLElement;

    expect(
      [...toolbar.children].map((child) => child.querySelector('input, select')?.tagName),
    ).toEqual(['INPUT', 'SELECT']);
    const search = toolbar.querySelector('input') as HTMLInputElement;
    search.value = 'طرطوس';
    search.dispatchEvent(new Event('input'));
    const category = toolbar.querySelector('select') as HTMLSelectElement;
    category.value = 'category-1';
    category.dispatchEvent(new Event('change'));
    category.value = '';
    category.dispatchEvent(new Event('change'));

    expect(searches).toEqual(['طرطوس']);
    expect(categories).toEqual(['category-1', null]);
  });

  it('shows skeleton rows while loading', () => {
    const element = render({ isLoading: true }).nativeElement as HTMLElement;

    expect(element.querySelector('tbody[app-table-skeleton]')).not.toBeNull();
  });

  it('says why the table is empty', () => {
    const element = render({ rows: [], emptyMessage: 'لا توجد متاجر مرتبطة بهذه المنصة بعد' })
      .nativeElement as HTMLElement;

    expect(element.querySelector('app-table-empty')?.textContent).toContain(
      'لا توجد متاجر مرتبطة بهذه المنصة بعد',
    );
  });

  it('offers a retry when the stores could not load', () => {
    const fixture = render({ error: 'تعذر التحميل' });
    let retryCount = 0;
    fixture.componentInstance.retry.subscribe(() => retryCount++);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('table')).toBeNull();
    (element.querySelector('app-error-state button') as HTMLButtonElement).click();

    expect(retryCount).toBe(1);
  });
});
