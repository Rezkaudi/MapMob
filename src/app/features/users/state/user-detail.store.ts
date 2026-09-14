import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { UserRepository } from '../data/user.repository';
import { UserDetail } from '../models/user-detail';
import {
  buildActivityRows,
  buildDetailStatCards,
  buildFavoriteRows,
  buildReviewRows,
} from './user-detail-view';
import { buildUserProfileView } from './user-profile-view';

/** The design lists three favourites and two reviews before "عرض الكل". */
const COLLAPSED_FAVORITE_COUNT = 3;
const COLLAPSED_REVIEW_COUNT = 2;
const SHOW_LESS_LABEL = 'عرض أقل';

interface UserDetailState {
  readonly detail: UserDetail | null;
  readonly isShowingAllFavorites: boolean;
  readonly isShowingAllReviews: boolean;
}

const initialState: UserDetailState = {
  detail: null,
  isShowingAllFavorites: false,
  isShowingAllReviews: false,
};

function toggleLabel(total: number, collapsedCount: number, isShowingAll: boolean): string {
  if (total <= collapsedCount) {
    return '';
  }
  return isShowingAll ? SHOW_LESS_LABEL : `عرض الكل (${total})`;
}

export const UserDetailStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ detail, isShowingAllFavorites, isShowingAllReviews }, clock = inject(CLOCK)) => {
    const favoriteRows = computed(() => buildFavoriteRows(detail()?.favoritePlaces ?? [], clock()));
    const reviewRows = computed(() => buildReviewRows(detail()?.reviews ?? []));
    return {
      user: computed(() => detail()?.user ?? null),
      profile: computed(() => {
        const user = detail()?.user;
        return user ? buildUserProfileView(user, clock()) : null;
      }),
      statCards: computed(() => {
        const stats = detail()?.stats;
        return stats ? buildDetailStatCards(stats) : [];
      }),
      activityRows: computed(() => buildActivityRows(detail()?.activities ?? [], clock())),
      visibleFavoriteRows: computed(() =>
        isShowingAllFavorites()
          ? favoriteRows()
          : favoriteRows().slice(0, COLLAPSED_FAVORITE_COUNT),
      ),
      favoritesToggleLabel: computed(() =>
        toggleLabel(favoriteRows().length, COLLAPSED_FAVORITE_COUNT, isShowingAllFavorites()),
      ),
      visibleReviewRows: computed(() =>
        isShowingAllReviews() ? reviewRows() : reviewRows().slice(0, COLLAPSED_REVIEW_COUNT),
      ),
      reviewsToggleLabel: computed(() =>
        toggleLabel(reviewRows().length, COLLAPSED_REVIEW_COUNT, isShowingAllReviews()),
      ),
    };
  }),
  withMethods((store, repository = inject(UserRepository)) => ({
    loadUser: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, initialState);
          store.setLoading();
        }),
        switchMap((id) =>
          repository.getUserDetail(id).pipe(
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
    toggleAllFavorites(): void {
      patchState(store, { isShowingAllFavorites: !store.isShowingAllFavorites() });
    },
    toggleAllReviews(): void {
      patchState(store, { isShowingAllReviews: !store.isShowingAllReviews() });
    },
  })),
);
