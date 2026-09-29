import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { OwnerReviewsRepository } from '../data/owner-reviews.repository';
import { NO_OWNER_REVIEW_FILTERS } from '../models/owner-review-filters';
import { OwnerReviewQuery } from '../models/owner-review-query';
import { ReviewReport } from '../models/review-report';
import { buildOwnerReview, buildOwnerReviewSummary } from '../testing/owner-review-fixture';
import { MERCHANT_REVIEWS_PAGE_SIZE, MerchantReviewsStore } from './merchant-reviews.store';

const AHMAD = buildOwnerReview();
const TODAY = new Date(2026, 8, 20, 10, 0);
const REPORT: ReviewReport = { reason: 'abusive', notes: null };

function createStore(overrides: Partial<OwnerReviewsRepository> = {}) {
  const requestedQueries: OwnerReviewQuery[] = [];
  const sentReports: [string, ReviewReport][] = [];
  const repository: OwnerReviewsRepository = {
    getReviews: (query) => {
      requestedQueries.push(query);
      return of({ items: [AHMAD], totalCount: 9 });
    },
    getSummary: () => of(buildOwnerReviewSummary()),
    reportReview: (id, report) => {
      sentReports.push([id, report]);
      return of({ ...AHMAD, reportStatus: 'pending' });
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      MerchantReviewsStore,
      { provide: OwnerReviewsRepository, useValue: repository },
      { provide: CLOCK, useValue: () => TODAY },
    ],
  });
  return { store: TestBed.inject(MerchantReviewsStore), requestedQueries, sentReports };
}

describe('MerchantReviewsStore', () => {
  it('draws four rows per page, as the design does', () => {
    expect(createStore().store.pageSize()).toBe(MERCHANT_REVIEWS_PAGE_SIZE);
    expect(MERCHANT_REVIEWS_PAGE_SIZE).toBe(4);
  });

  it('loads a page of reviews and the summary card', () => {
    const { store } = createStore();

    store.load();

    expect(store.entries()).toEqual([AHMAD]);
    expect(store.totalCount()).toBe(9);
    expect(store.summaryView()?.averageText).toBe('4.6');
  });

  it('keeps the table when only the summary fails', () => {
    const { store } = createStore({ getSummary: () => throwError(() => new Error('خطأ')) });

    store.load();

    expect(store.summaryView()).toBeNull();
    expect(store.hasSummaryFailed()).toBe(true);
    expect(store.entries()).toEqual([AHMAD]);
  });

  it('reports a failed page load', () => {
    const { store } = createStore({
      getReviews: () => throwError(() => new Error('تعذر تحميل المراجعات')),
    });

    store.load();

    expect(store.error()).toBe('تعذر تحميل المراجعات');
  });

  it('asks again from the first page with the search, sort and filters', () => {
    const { store, requestedQueries } = createStore();
    store.load();
    store.changePage(1);

    store.setSearch(' أحمد ');
    store.setSort('oldest');
    store.applyFilters({
      ...NO_OWNER_REVIEW_FILTERS,
      rating: 2,
      reportStatus: 'pending',
      period: 'custom',
      customRange: { from: '2026-09-01', to: '2026-09-10' },
    });

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 4,
      search: 'أحمد',
      sort: 'oldest',
      rating: 2,
      reportStatus: 'pending',
      submittedFrom: '2026-09-01',
      submittedTo: '2026-09-10',
    });
    expect(store.activeFilterCount()).toBe(3);
  });

  it('tells an empty place apart from a search that found nothing', () => {
    const { store } = createStore({ getReviews: () => of({ items: [], totalCount: 0 }) });
    store.load();

    expect(store.hasNoReviews()).toBe(true);
    expect(store.emptyMessage()).toBe('لا توجد تقييمات لعرضها');

    store.setSearch('سارة');

    expect(store.hasNoReviews()).toBe(false);
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });

  it('opens the details, then the report from them, and closes', () => {
    const { store } = createStore();

    store.openDetails(AHMAD);
    expect(store.detailsReview()).toEqual(AHMAD);
    expect(store.reportedReview()).toBeNull();

    store.openReport(AHMAD);
    expect(store.detailsReview()).toBeNull();
    expect(store.reportedReview()).toEqual(AHMAD);

    store.closeDialog();
    expect(store.reportedReview()).toBeNull();
  });

  it('sends the report, closes the dialog and reloads the page', async () => {
    const { store, sentReports, requestedQueries } = createStore();
    store.load();
    store.openReport(AHMAD);

    expect(await store.submitReport(REPORT)).toBe(true);

    expect(sentReports).toEqual([[AHMAD.id, REPORT]]);
    expect(store.reportedReview()).toBeNull();
    expect(requestedQueries).toHaveLength(2);
  });

  it('keeps the dialog open with the reason when the report fails', async () => {
    const { store } = createStore({
      reportReview: () => throwError(() => new Error('تم الإبلاغ عن هذه المراجعة من قبل.')),
    });
    store.openReport(AHMAD);

    expect(await store.submitReport(REPORT)).toBe(false);

    expect(store.reportedReview()).toEqual(AHMAD);
    expect(store.saveError()).toBe('تم الإبلاغ عن هذه المراجعة من قبل.');
  });
});
