import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, lastValueFrom, of, pipe, switchMap, tap } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { ListSort } from '../../../shared/models/list-sort';
import { resolveDatePeriodRange } from '../../../shared/state/date-period-range';
import { withListTable } from '../../../shared/state/with-list-table';
import { ReviewRepository } from '../data/review.repository';
import { Review } from '../models/review';
import { NO_REVIEW_FILTERS, ReviewFilters } from '../models/review-filters';
import { ReviewQuery } from '../models/review-query';
import { ModeratedReviewStatus } from '../models/review-status';
import { ReviewSummary } from '../models/review-summary';
import { countActiveReviewFilters } from './count-active-review-filters';
import { buildReviewStatCards } from './review-stat-cards';

/** The reviews design draws four rows per page. */
export const REVIEWS_PAGE_SIZE = 4;

const NO_REVIEWS_MESSAGE = 'لا توجد تقييمات لعرضها';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة للبحث أو الفلاتر';

interface ReviewsState {
  readonly filters: ReviewFilters;
  readonly summary: ReviewSummary | null;
  readonly hasSummaryFailed: boolean;
  readonly isExporting: boolean;
}

const initialState: ReviewsState = {
  filters: NO_REVIEW_FILTERS,
  summary: null,
  hasSummaryFailed: false,
  isExporting: false,
};

export const ReviewsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withListTable<Review>({ pageSize: REVIEWS_PAGE_SIZE }),
  withComputed(({ filters, search, summary, hasSummaryFailed, hasNoEntries }) => {
    const activeFilterCount = computed(() => countActiveReviewFilters(filters()));
    return {
      activeFilterCount,
      statCards: computed(() => buildReviewStatCards(summary())),
      isSummaryLoading: computed(() => summary() === null && !hasSummaryFailed()),
      /** Nothing to review at all: the page drops its toolbar and table for the empty message. */
      hasNoReviews: computed(() => hasNoEntries() && activeFilterCount() === 0),
      emptyMessage: computed(() =>
        search().trim() || activeFilterCount() > 0 ? NO_MATCHES_MESSAGE : NO_REVIEWS_MESSAGE,
      ),
    };
  }),
  withMethods((store, repository = inject(ReviewRepository), clock = inject(CLOCK)) => {
    const currentReviewQuery = (): ReviewQuery => {
      const { rating, status, placeName, period, customRange } = store.filters();
      const { from, to } = resolveDatePeriodRange(period, customRange, clock());
      const trimmedPlaceName = placeName.trim();
      return {
        ...store.currentQuery(),
        ...(rating ? { rating } : {}),
        ...(status ? { status } : {}),
        ...(trimmedPlaceName ? { placeName: trimmedPlaceName } : {}),
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

    return {
      currentReviewQuery,
      loadReviews,

      loadSummary: rxMethod<void>(
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
      ),
    };
  }),
  withMethods((store, repository = inject(ReviewRepository)) => {
    const reloadAll = () => {
      store.loadReviews();
      store.loadSummary();
    };
    const saveThenReload = (request: Observable<unknown>, onSaved?: () => void) =>
      store.saveThenRefresh(request, reloadAll, onSaved);

    return {
      setSearch(search: string): void {
        store.applyQuery({ search });
        store.loadReviews();
      },
      setSort(sort: ListSort | null): void {
        store.applyQuery({ sort });
        store.loadReviews();
      },
      applyFilters(filters: ReviewFilters): void {
        patchState(store, { filters });
        store.resetToFirstPage();
        store.loadReviews();
      },
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.clearSelection();
        store.loadReviews();
      },
      acceptReport(id: string): Promise<boolean> {
        return saveThenReload(repository.acceptReport(id));
      },
      rejectReport(id: string): Promise<boolean> {
        return saveThenReload(repository.rejectReport(id));
      },
      setReviewStatus(id: string, status: ModeratedReviewStatus): Promise<boolean> {
        return saveThenReload(repository.setReviewStatus(id, status));
      },
      deleteReview(id: string): Promise<boolean> {
        return saveThenReload(repository.deleteReview(id), () => store.forgetRemovedEntry(id));
      },
      /** Resolves the file to save, or `null` when the export failed and `saveError` says why. */
      async exportReviews(): Promise<Blob | null> {
        patchState(store, { isExporting: true, saveError: null });
        try {
          return await lastValueFrom(repository.exportReviews(store.currentReviewQuery()));
        } catch (error) {
          patchState(store, { saveError: (error as Error).message });
          return null;
        } finally {
          patchState(store, { isExporting: false });
        }
      },
    };
  }),
);
