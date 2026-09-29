import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { OwnerReviewsRepository } from '../../data/owner-reviews.repository';
import { ReviewReport } from '../../models/review-report';
import { buildOwnerReview, buildOwnerReviewSummary } from '../../testing/owner-review-fixture';
import { MerchantReviewsPage } from './merchant-reviews-page';

const AHMAD = buildOwnerReview();

function createPage() {
  const sentReports: ReviewReport[] = [];
  const repository: OwnerReviewsRepository = {
    getReviews: () => of({ items: [AHMAD], totalCount: 30 }),
    getSummary: () => of(buildOwnerReviewSummary()),
    reportReview: (_id, report) => {
      sentReports.push(report);
      return of({ ...AHMAD, reportStatus: 'pending' });
    },
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: OwnerReviewsRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date(2026, 8, 20) },
    ],
  });
  const fixture = TestBed.createComponent(MerchantReviewsPage);
  fixture.detectChanges();
  return { fixture, sentReports };
}

const elementOf = (fixture: ComponentFixture<MerchantReviewsPage>) =>
  fixture.nativeElement as HTMLElement;

function clickButton(element: HTMLElement, label: string): void {
  Array.from(element.querySelectorAll<HTMLButtonElement>('button'))
    .find((button) => button.textContent?.trim() === label)!
    .click();
}

describe('MerchantReviewsPage', () => {
  it('heads the page the way the rating frame words it', () => {
    const page = elementOf(createPage().fixture);

    expect(page.querySelector('h1')?.textContent?.trim()).toBe('التقييمات والمراجعات');
    expect(page.querySelector('app-page-header p')?.textContent?.trim()).toBe(
      'اطلع على تقييمات العملاء ومراجعاتهم',
    );
  });

  it('shows the summary card, the toolbar, the table and the paging, in that order', () => {
    const page = elementOf(createPage().fixture);

    const parts = Array.from(
      page.querySelectorAll(
        'app-rating-summary-card, app-owner-review-toolbar, app-owner-review-table, app-table-pagination',
      ),
    ).map((part) => part.tagName.toLowerCase());
    expect(parts).toEqual([
      'app-rating-summary-card',
      'app-owner-review-toolbar',
      'app-owner-review-table',
      'app-table-pagination',
    ]);
    expect(page.querySelector('[data-role="average"]')?.textContent?.trim()).toBe('4.6');
    expect(page.querySelector('app-table-pagination')?.textContent).toContain('مراجعة');
  });

  it('opens the full review, goes on to the report and sends it', () => {
    const { fixture, sentReports } = createPage();
    const page = elementOf(fixture);

    page.querySelector<HTMLButtonElement>('[data-role="open-review"]')!.click();
    fixture.detectChanges();
    expect(page.querySelector('app-review-details-dialog')).not.toBeNull();

    clickButton(page, 'الإبلاغ عن المراجعة');
    fixture.detectChanges();
    expect(page.querySelector('app-review-details-dialog')).toBeNull();

    page.querySelector<HTMLInputElement>('app-review-report-dialog input[type="radio"]')!.click();
    fixture.detectChanges();
    clickButton(page, 'إرسال البلاغ');
    fixture.detectChanges();

    expect(sentReports).toEqual([{ reason: 'abusive', notes: null }]);
  });
});
