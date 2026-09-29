import { TestBed } from '@angular/core/testing';
import { buildRatingSummaryView } from '../../state/rating-summary-view';
import { buildOwnerReviewSummary } from '../../testing/owner-review-fixture';
import { StarDistribution } from './star-distribution';

describe('StarDistribution', () => {
  it('draws one bar for each of 5 to 1 stars, with its count and share', () => {
    const fixture = TestBed.createComponent(StarDistribution);
    fixture.componentRef.setInput(
      'rows',
      buildRatingSummaryView(buildOwnerReviewSummary()).starRows,
    );
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    const rows = Array.from(element.querySelectorAll('li'));
    const meters = element.querySelectorAll('[role="meter"]');
    expect(
      rows.map((row) => row.querySelector('[data-role="stars"]')?.textContent?.trim()),
    ).toEqual(['5', '4', '3', '2', '1']);
    expect(rows[0].querySelector('[data-role="count"]')?.textContent?.trim()).toBe('85 (66%)');
    expect(meters[0].getAttribute('aria-label')).toBe('5 نجوم');
    expect(meters[4].getAttribute('aria-label')).toBe('نجمة واحدة');
  });
});
