import { TestBed } from '@angular/core/testing';
import { NO_REVIEW_FILTERS } from '../../models/review-filters';
import { ReviewToolbar } from './review-toolbar';

function render() {
  const fixture = TestBed.createComponent(ReviewToolbar);
  fixture.componentRef.setInput('filters', NO_REVIEW_FILTERS);
  fixture.componentRef.setInput('activeFilterCount', 1);
  fixture.detectChanges();
  return fixture;
}

function filterButton(element: HTMLElement): HTMLButtonElement {
  return element.querySelector('button[aria-controls="review-filter-panel"]') as HTMLButtonElement;
}

describe('ReviewToolbar', () => {
  it('searches reviews, with the 8px gap the design keeps between sort and filters', () => {
    const fixture = render();
    const searchChange = vi.fn();
    fixture.componentInstance.searchChange.subscribe(searchChange);
    const element = fixture.nativeElement as HTMLElement;

    const search = element.querySelector('input[type="search"]') as HTMLInputElement;
    expect(search.placeholder).toBe('ابحث عن تقييم..');
    search.value = 'سارة';
    search.dispatchEvent(new Event('input'));

    expect(searchChange).toHaveBeenCalledWith('سارة');
    expect((element.querySelector('app-sort-select')?.parentElement as HTMLElement).style.gap).toBe(
      '8px',
    );
    expect(filterButton(element).getAttribute('aria-label')).toBe('الفلاتر، 1 مفعلة');
  });

  it('opens the review filter panel and passes the applied filters on, closing it', () => {
    const fixture = render();
    const filtersApply = vi.fn();
    fixture.componentInstance.filtersApply.subscribe(filtersApply);
    const element = fixture.nativeElement as HTMLElement;

    filterButton(element).click();
    fixture.detectChanges();
    expect(element.querySelector('app-review-filter-panel')).toBeTruthy();
    const apply = Array.from(element.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'تطبيق الفلاتر',
    ) as HTMLButtonElement;
    apply.click();
    fixture.detectChanges();

    expect(filtersApply).toHaveBeenCalledWith(NO_REVIEW_FILTERS);
    expect(element.querySelector('app-review-filter-panel')).toBeNull();
  });
});
