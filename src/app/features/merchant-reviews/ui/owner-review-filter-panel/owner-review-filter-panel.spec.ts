import { TestBed } from '@angular/core/testing';
import { NO_OWNER_REVIEW_FILTERS, OwnerReviewFilters } from '../../models/owner-review-filters';
import { OwnerReviewFilterPanel } from './owner-review-filter-panel';

function build() {
  const fixture = TestBed.createComponent(OwnerReviewFilterPanel);
  fixture.componentRef.setInput('filters', NO_OWNER_REVIEW_FILTERS);
  fixture.detectChanges();
  const applied: OwnerReviewFilters[] = [];
  fixture.componentInstance.applied.subscribe((filters) => applied.push(filters));
  return { fixture, element: fixture.nativeElement as HTMLElement, applied };
}

function clickButton(element: HTMLElement, label: string): void {
  Array.from(element.querySelectorAll('button'))
    .find((button) => button.textContent?.trim() === label)!
    .click();
}

describe('OwnerReviewFilterPanel', () => {
  it('applies the picked stars and report status together', () => {
    const { fixture, element, applied } = build();

    clickButton(element, '4');
    clickButton(element, 'قيد المراجعة');
    fixture.detectChanges();
    clickButton(element, 'تطبيق الفلاتر');

    expect(applied).toEqual([{ ...NO_OWNER_REVIEW_FILTERS, rating: 4, reportStatus: 'pending' }]);
  });

  it('clears every group on reset', () => {
    const { element, applied } = build();

    clickButton(element, 'إعادة ضبط');

    expect(applied).toEqual([NO_OWNER_REVIEW_FILTERS]);
  });
});
