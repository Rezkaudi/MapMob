import { TestBed } from '@angular/core/testing';
import { OwnerReview } from '../../models/owner-review';
import { buildOwnerReview } from '../../testing/owner-review-fixture';
import { ReviewDetailsDialog } from './review-details-dialog';

const AHMAD = buildOwnerReview({
  author: { id: 'user-4', name: 'أحمد محمد' },
  createdAt: '2026-09-15T10:00:00.000Z',
});

function build(review: OwnerReview = AHMAD) {
  const fixture = TestBed.createComponent(ReviewDetailsDialog);
  fixture.componentRef.setInput('review', review);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement | undefined {
  return Array.from(element.querySelectorAll('footer button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement | undefined;
}

describe('ReviewDetailsDialog', () => {
  it('shows who wrote the review, when, its stars and the whole comment', () => {
    const { element } = build();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تفاصيل المراجعة');
    expect(element.querySelector('[data-role="author"]')?.textContent?.trim()).toBe('أحمد محمد');
    expect(element.querySelector('[data-role="date"]')?.textContent?.trim()).toBe('١٥ سبتمبر ٢٠٢٦');
    expect(element.querySelector('[data-role="score"]')?.textContent?.trim()).toBe('5.0');
    expect(element.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('5 من 5 نجوم');
    expect(element.querySelector('[data-role="comment"]')?.textContent).toContain(AHMAD.comment);
  });

  it('moves on to the report, or closes on cancel', () => {
    const { fixture, element } = build();
    let reportCount = 0;
    let closeCount = 0;
    fixture.componentInstance.report.subscribe(() => reportCount++);
    fixture.componentInstance.closed.subscribe(() => closeCount++);

    buttonNamed(element, 'الإبلاغ عن المراجعة')!.click();
    buttonNamed(element, 'إلغاء')!.click();

    expect(reportCount).toBe(1);
    expect(closeCount).toBe(1);
  });

  it('offers no second report once the review has been reported', () => {
    const { element } = build(buildOwnerReview({ reportStatus: 'pending' }));

    expect(buttonNamed(element, 'الإبلاغ عن المراجعة')).toBeUndefined();
  });

  it('says so when the review carries no stars', () => {
    const { element } = build(buildOwnerReview({ rating: null }));

    expect(element.querySelector('[data-role="score"]')?.textContent?.trim()).toBe('—');
    expect(element.querySelector('[role="img"]')).toBeNull();
  });
});
