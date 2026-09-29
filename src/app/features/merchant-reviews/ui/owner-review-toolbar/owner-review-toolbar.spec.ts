import { TestBed } from '@angular/core/testing';
import { NO_OWNER_REVIEW_FILTERS } from '../../models/owner-review-filters';
import { OwnerReviewToolbar } from './owner-review-toolbar';

function render() {
  const fixture = TestBed.createComponent(OwnerReviewToolbar);
  fixture.componentRef.setInput('filters', NO_OWNER_REVIEW_FILTERS);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('OwnerReviewToolbar', () => {
  it('searches by reviewer name, with sort and filters 8px apart', () => {
    const { fixture, element } = render();
    const searches: string[] = [];
    fixture.componentInstance.searchChange.subscribe((search) => searches.push(search));

    const search = element.querySelector('input[type="search"]') as HTMLInputElement;
    expect(search.placeholder).toBe('ابحث باسم صاحب تعليق ..');
    search.value = 'أحمد';
    search.dispatchEvent(new Event('input'));

    expect(searches).toEqual(['أحمد']);
    expect((element.querySelector('app-sort-select')?.parentElement as HTMLElement).style.gap).toBe(
      '8px',
    );
  });

  it('opens the filter panel and passes the applied filters on, closing it', () => {
    const { fixture, element } = render();
    const applied: unknown[] = [];
    fixture.componentInstance.filtersApply.subscribe((filters) => applied.push(filters));

    element
      .querySelector<HTMLButtonElement>('button[aria-controls="owner-review-filter-panel"]')!
      .click();
    fixture.detectChanges();
    Array.from(element.querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === 'تطبيق الفلاتر')!
      .click();
    fixture.detectChanges();

    expect(applied).toEqual([NO_OWNER_REVIEW_FILTERS]);
    expect(element.querySelector('app-owner-review-filter-panel')).toBeNull();
  });
});
