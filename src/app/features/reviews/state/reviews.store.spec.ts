import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { ReviewRepository } from '../data/review.repository';
import { NO_REVIEW_FILTERS } from '../models/review-filters';
import { ReviewQuery } from '../models/review-query';
import { buildReview } from '../testing/review-fixture';
import { REVIEWS_PAGE_SIZE, ReviewsStore } from './reviews.store';

const AHMAD = buildReview();
const SUMMARY = { totalCount: 3000, averageRating: 4.3, newCount: 14, reportedCount: 4 };
const TODAY = new Date(2026, 8, 15, 10, 0);

function createStore(overrides: Partial<ReviewRepository> = {}) {
  const requestedQueries: ReviewQuery[] = [];
  let summaryLoads = 0;
  const repository: Partial<ReviewRepository> = {
    getReviews: (query) => {
      requestedQueries.push(query);
      return of({ items: [AHMAD], totalCount: 1 });
    },
    getSummary: () => {
      summaryLoads += 1;
      return of(SUMMARY);
    },
    acceptReport: () => of(buildReview({ status: 'hidden' })),
    rejectReport: () => of(buildReview({ status: 'published' })),
    setReviewStatus: () => of(buildReview({ status: 'hidden' })),
    deleteReview: () => of(undefined),
    exportReviews: () => of(new Blob(['csv'])),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: ReviewRepository, useValue: repository },
      { provide: CLOCK, useValue: () => TODAY },
    ],
  });
  return {
    store: TestBed.inject(ReviewsStore),
    requestedQueries,
    summaryLoads: () => summaryLoads,
  };
}

describe('ReviewsStore', () => {
  it('draws four rows per page, as the design does', () => {
    expect(createStore().store.pageSize()).toBe(REVIEWS_PAGE_SIZE);
    expect(REVIEWS_PAGE_SIZE).toBe(4);
  });

  it('loads a page of reviews and the summary, then builds the stat cards', () => {
    const { store } = createStore();

    store.loadReviews();
    store.loadSummary();

    expect(store.entries()).toEqual([AHMAD]);
    expect(store.totalCount()).toBe(1);
    expect(store.isSummaryLoading()).toBe(false);
    expect(store.statCards().map((card) => card.value)).toEqual(['3,000', '4.3', '14', '4']);
  });

  it('reports a failed load', () => {
    const { store } = createStore({
      getReviews: () => throwError(() => new Error('تعذر التحميل')),
    });

    store.loadReviews();

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('turns the applied filters into the query, resolving the date preset from today', () => {
    const { store, requestedQueries } = createStore();

    store.applyFilters({
      rating: 'fourStarsAndUp',
      status: 'reported',
      placeName: '  صيدلية الحياة ',
      period: 'last7Days',
      customRange: { from: null, to: null },
    });

    expect(store.activeFilterCount()).toBe(4);
    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: REVIEWS_PAGE_SIZE,
      rating: 'fourStarsAndUp',
      status: 'reported',
      placeName: 'صيدلية الحياة',
      submittedFrom: '2026-09-09',
      submittedTo: '2026-09-15',
    });
  });

  it('searches and sorts from the first page', () => {
    const { store, requestedQueries } = createStore();

    store.setSearch('سارة');
    store.setSort('newest');

    expect(requestedQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: REVIEWS_PAGE_SIZE,
      search: 'سارة',
      sort: 'newest',
    });
  });

  it('shows the empty page only when no review exists, not when filters match nothing', () => {
    const { store } = createStore({ getReviews: () => of({ items: [], totalCount: 0 }) });

    store.loadReviews();
    expect(store.hasNoReviews()).toBe(true);

    store.applyFilters({ ...NO_REVIEW_FILTERS, status: 'hidden' });
    expect(store.hasNoReviews()).toBe(false);
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة للبحث أو الفلاتر');
  });

  it('settles reports and changes a status, reloading the page and the summary after each', async () => {
    const { store, requestedQueries, summaryLoads } = createStore();

    expect(await store.acceptReport('review-2')).toBe(true);
    expect(await store.rejectReport('review-3')).toBe(true);
    expect(await store.setReviewStatus('review-1', 'hidden')).toBe(true);

    expect(requestedQueries).toHaveLength(3);
    expect(summaryLoads()).toBe(3);
  });

  it('keeps the error when a delete fails', async () => {
    const { store } = createStore({
      deleteReview: () => throwError(() => new Error('تعذر الحذف')) as Observable<void>,
    });

    expect(await store.deleteReview('review-1')).toBe(false);
    expect(store.saveError()).toBe('تعذر الحذف');
  });

  it('exports every review matching the current filters, not only this page', async () => {
    let exportedQuery: ReviewQuery | undefined;
    const file = new Blob(['csv']);
    const { store } = createStore({
      exportReviews: (query) => {
        exportedQuery = query;
        return of(file);
      },
    });
    store.applyFilters({ ...NO_REVIEW_FILTERS, rating: 'unrated' });

    expect(await store.exportReviews()).toBe(file);
    expect(exportedQuery?.rating).toBe('unrated');
    expect(store.isExporting()).toBe(false);
  });

  it('gives no file and a message when the export fails', async () => {
    const { store } = createStore({
      exportReviews: () => throwError(() => new Error('تعذر التصدير')),
    });

    expect(await store.exportReviews()).toBeNull();
    expect(store.saveError()).toBe('تعذر التصدير');
  });
});
