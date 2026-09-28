import { TestBed } from '@angular/core/testing';
import { ListSort } from '../../../../shared/models/list-sort';
import { ProductToolbar } from './product-toolbar';

describe('ProductToolbar', () => {
  it('puts the search on the right and the sort on the left, and reports both', () => {
    const fixture = TestBed.createComponent(ProductToolbar);
    const searches: string[] = [];
    const sorts: (ListSort | null)[] = [];
    fixture.componentInstance.searchChange.subscribe((search) => searches.push(search));
    fixture.componentInstance.sortChange.subscribe((sort) => sorts.push(sort));
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;

    const row = host.querySelector('[data-role="toolbar-row"]') as HTMLElement;
    expect([...row.children].map((child) => child.tagName.toLowerCase())).toEqual([
      'app-list-search-field',
      'app-sort-select',
    ]);

    const search = host.querySelector('input[type="search"]') as HTMLInputElement;
    expect(search.placeholder).toBe('ابحث عن منتج / خدمة بالاسم..');
    search.value = 'مرطب';
    search.dispatchEvent(new Event('input'));
    const sort = host.querySelector('select') as HTMLSelectElement;
    sort.value = 'name';
    sort.dispatchEvent(new Event('change'));

    expect(searches).toEqual(['مرطب']);
    expect(sorts).toEqual(['name']);
  });
});
