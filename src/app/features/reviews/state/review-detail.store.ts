import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { ReviewRepository } from '../data/review.repository';
import { ReviewDetail } from '../models/review-detail';
import { buildReviewDetailView } from './review-detail-view';

interface ReviewDetailState {
  readonly openReviewId: string | null;
  readonly detail: ReviewDetail | null;
}

const initialState: ReviewDetailState = { openReviewId: null, detail: null };

/** The review the side drawer shows, if any. */
export const ReviewDetailStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ openReviewId, detail }) => ({
    isOpen: computed(() => openReviewId() !== null),
    view: computed(() => {
      const openDetail = detail();
      return openDetail ? buildReviewDetailView(openDetail) : null;
    }),
  })),
  withMethods((store, repository = inject(ReviewRepository)) => ({
    loadDetail: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, { detail: null });
          store.setLoading();
        }),
        switchMap((id) =>
          repository.getReviewDetail(id).pipe(
            tap((detail) => {
              patchState(store, { detail });
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
    open(id: string): void {
      patchState(store, { openReviewId: id });
      store.loadDetail(id);
    },
    reload(): void {
      const id = store.openReviewId();
      if (id) {
        store.loadDetail(id);
      }
    },
    close(): void {
      patchState(store, initialState);
    },
  })),
);
