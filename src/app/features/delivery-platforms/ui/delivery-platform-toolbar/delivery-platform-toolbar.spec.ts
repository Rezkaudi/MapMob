import { TestBed } from '@angular/core/testing';
import { DeliveryPlatformToolbar } from './delivery-platform-toolbar';

function render() {
  const fixture = TestBed.createComponent(DeliveryPlatformToolbar);
  fixture.detectChanges();
  return fixture;
}

describe('DeliveryPlatformToolbar', () => {
  it('puts the search first, so RTL draws it on the right, and the sort after it', () => {
    const bar = (render().nativeElement as HTMLElement).firstElementChild as HTMLElement;

    expect([...bar.children].map((child) => child.tagName.toLowerCase())).toEqual([
      'app-list-search-field',
      'app-sort-select',
    ]);
    expect(bar.querySelector('input')?.placeholder).toBe('ابحث عن منصة توصيل..');
  });

  it('reports the search and the sort', () => {
    const fixture = render();
    const searches: string[] = [];
    const sorts: unknown[] = [];
    fixture.componentInstance.searchChange.subscribe((search) => searches.push(search));
    fixture.componentInstance.sortChange.subscribe((sort) => sorts.push(sort));
    const element = fixture.nativeElement as HTMLElement;

    const search = element.querySelector('input') as HTMLInputElement;
    search.value = 'طلبات';
    search.dispatchEvent(new Event('input'));
    const sort = element.querySelector('select') as HTMLSelectElement;
    sort.value = 'name';
    sort.dispatchEvent(new Event('change'));

    expect(searches).toEqual(['طلبات']);
    expect(sorts).toEqual(['name']);
  });
});
