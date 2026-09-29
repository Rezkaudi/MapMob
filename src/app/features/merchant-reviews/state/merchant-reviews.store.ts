import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { ListSort } from '../../../shared/models/list-sort';
import { resolveDatePeriodRange } from '../../../shared/state/date-period-range';
import { withListTable } from '../../../shared/state/with-list-table';
import { OwnerReviewsRepository } from '../data/owner-reviews.repository';
import { OwnerReview } from '../models/owner-review';
import { NO_OWNER_REVIEW_FILTERS, OwnerReviewFilters } from '../models/owner-review-filters';
import { OwnerReviewQuery } from '../models/owner-review-query';
import { OwnerReviewSummary } from '../models/owner-review-summary';
import { ReviewReport } from '../models/review-report';
import { countOwnerReviewFilters } from './count-owner-review-filters';
import { buildRatingSummaryView } from './rating-summary-view';
import { withReviewDialogs } from './with-review-dialogs';

/** The "rating" frame draws four rows per page. */
export const MERCHANT_REVIEWS_PAGE_SIZE = 4;

const NO_REVIEWS_MESSAGE = 'لا توجد تقييمات لعرضها';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة للبحث أو الفلاتر';

interface MerchantReviewsState {
  readonly filters: OwnerReviewFilters;
  readonly summary: OwnerReviewSummary | null;
  readonly hasSummaryFailed: boolean;
}

/** The merchant's "التقييمات والمراجعات" page. */
export const MerchantReviewsStore = signalStore(
  withState<MerchantReviewsState>({
    filters: NO_OWNER_REVIEW_FILTERS,
    summary: null,
    hasSummaryFailed: false,
  }),
  withListTable<OwnerReview>({ pageSize: MERCHANT_REVIEWS_PAGE_SIZE }),
  withReviewDialogs(),
  withComputed(({ filters, search, summary, hasNoEntries }) => {
    const activeFilterCount = computed(() => countOwnerReviewFilters(filters()));
    return {
      activeFilterCount,
      summaryView: computed(() => {
        const loaded = summary();
        return loaded ? buildRatingSummaryView(loaded) : null;
      }),
      /** Nothing to show at all: the page drops its toolbar and table for the empty message. */
      hasNoReviews: computed(() => hasNoEntries() && activeFilterCount() === 0),
      emptyMessage: computed(() =>
        search().trim() || activeFilterCount() > 0 ? NO_MATCHES_MESSAGE : NO_REVIEWS_MESSAGE,
      ),
    };
  }),
  withMethods((store, repository = inject(OwnerReviewsRepository), clock = inject(CLOCK)) => {
    const currentReviewQuery = (): OwnerReviewQuery => {
      const { rating, reportStatus, period, customRange } = store.filters();
      const { from, to } = resolveDatePeriodRange(period, customRange, clock());
      return {
        ...store.currentQuery(),
        ...(rating ? { rating } : {}),
        ...(reportStatus ? { reportStatus } : {}),
        ...(from ? { submittedFrom: from } : {}),
        ...(to ? { submittedTo: to } : {}),
      };
    };

    const loadReviews = rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getReviews(currentReviewQuery()).pipe(
            tap((page) => {
              if (store.showPage(page)) {
                loadReviews();
              }
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    );

    const loadSummary = rxMethod<void>(
      pipe(
        switchMap(() =>
          repository.getSummary().pipe(
            tap((summary) => patchState(store, { summary, hasSummaryFailed: false })),
            catchError(() => {
              patchState(store, { hasSummaryFailed: true });
              return of(null);
            }),
          ),
        ),
      ),
    );

    return { loadReviews, loadSummary };
  }),
  withMethods((store, repository = inject(OwnerReviewsRepository)) => ({
    load(): void {
      store.loadReviews();
      store.loadSummary();
    },
    setSearch(search: string): void {
      store.applyQuery({ search });
      store.loadReviews();
    },
    setSort(sort: ListSort | null): void {
      store.applyQuery({ sort });
      store.loadReviews();
    },
    applyFilters(filters: OwnerReviewFilters): void {
      patchState(store, { filters });
      store.resetToFirstPage();
      store.loadReviews();
    },
    changePage(pageIndex: number): void {
      store.goToPage(pageIndex);
      store.clearSelection();
      store.loadReviews();
    },
    /** Resolves `true` once sent; on failure the dialog stays open and `saveError` says why. */
    submitReport(report: ReviewReport): Promise<boolean> {
      const review = store.reportedReview();
      if (!review) {
        return Promise.resolve(false);
      }
      return store.saveThenRefresh(
        repository.reportReview(review.id, report),
        () => store.loadReviews(),
        () => store.closeDialog(),
      );
    },
  })),
);
