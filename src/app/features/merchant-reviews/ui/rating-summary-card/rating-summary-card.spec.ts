import { TestBed } from '@angular/core/testing';
import { RatingSummaryView, buildRatingSummaryView } from '../../state/rating-summary-view';
import { buildOwnerReviewSummary } from '../../testing/owner-review-fixture';
import { RatingSummaryCard } from './rating-summary-card';

function render(view: RatingSummaryView | null): HTMLElement {
  const fixture = TestBed.createComponent(RatingSummaryCard);
  fixture.componentRef.setInput('view', view);
  fixture.detectChanges();
  return fixture.nativeElement;
}

function textOf(element: HTMLElement, role: string): string | undefined {
  return element.querySelector(`[data-role="${role}"]`)?.textContent?.trim();
}

describe('RatingSummaryCard', () => {
  it('shows the score, what it is based on, this month and the policy', () => {
    const element = render(buildRatingSummaryView(buildOwnerReviewSummary()));

    expect(textOf(element, 'average')).toBe('4.6');
    expect(textOf(element, 'basis')).toBe('بناءً على 128 تقييماً موثقاً');
    expect(textOf(element, 'month-count')).toBe('18 تقييماً جديداً');
    expect(textOf(element, 'month-change')).toBe('+13%');
    expect(element.textContent).toContain('سياسة موثوقية المراجعات');
    expect(element.querySelectorAll('app-star-distribution li')).toHaveLength(5);
  });

  it('paints a falling month red and hides the change when there is nothing to compare', () => {
    const falling = render(
      buildRatingSummaryView(buildOwnerReviewSummary({ thisMonthCount: 8, lastMonthCount: 10 })),
    );
    const first = render(
      buildRatingSummaryView(buildOwnerReviewSummary({ thisMonthCount: 3, lastMonthCount: 0 })),
    );

    expect(falling.querySelector('[data-role="month-change"]')?.className).toContain(
      'text-status-error',
    );
    expect(first.querySelector('[data-role="month-change"]')).toBeNull();
  });

  it('holds its place with a loading block until the numbers arrive', () => {
    const element = render(null);

    expect(element.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(element.querySelector('[data-role="average"]')).toBeNull();
  });
});
