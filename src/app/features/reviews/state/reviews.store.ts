import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of, forkJoin } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withPagination } from '../../../shared/state/with-pagination';
import { ReviewRepository } from '../data/review.repository';
import { Review } from '../models/review';
import { ReviewStatus } from '../models/review-status';
import { ReviewSummary } from '../models/review-summary';

interface ReviewsFilterState {
  readonly reviews: readonly Review[];
  readonly search: string;
  readonly status: ReviewStatus | null;
  readonly summary: ReviewSummary | null;
}

const initialState: ReviewsFilterState = {
  reviews: [],
  search: '',
  status: null,
  summary: null,
};

export const ReviewsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withPagination(),
  withComputed(({ summary }) => ({
    hasSummary: computed(() => summary() !== null),
  })),
  withMethods((store, repository = inject(ReviewRepository)) => ({
    loadReviews: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          forkJoin({
            page: repository.getReviews({
              pageIndex: store.pageIndex(),
              pageSize: store.pageSize(),
              search: store.search() || undefined,
              status: store.status() ?? undefined,
            }),
            summary: repository.getSummary(),
          }).pipe(
            tap(({ page, summary }) => {
              patchState(store, { reviews: page.items, summary });
              store.setTotalCount(page.totalCount);
              store.setLoaded();
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    ),
  })),
  withMethods((store) => ({
    changePage(pageIndex: number): void {
      store.goToPage(pageIndex);
      store.loadReviews();
    },
    setSearch(search: string): void {
      patchState(store, { search });
      store.goToPage(0);
      store.loadReviews();
    },
    setStatusFilter(status: ReviewStatus | null): void {
      patchState(store, { status });
      store.goToPage(0);
      store.loadReviews();
    },
  })),
);
