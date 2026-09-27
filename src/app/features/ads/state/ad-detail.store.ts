import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { AdRepository } from '../data/ad.repository';
import { AdDetail } from '../models/ad-detail';
import { buildAdDetailView } from './ad-detail-view';

interface AdDetailState {
  readonly openAdId: string | null;
  readonly detail: AdDetail | null;
}

const initialState: AdDetailState = { openAdId: null, detail: null };

/** The ad the side drawer shows, if any. */
export const AdDetailStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ openAdId, detail }) => ({
    isOpen: computed(() => openAdId() !== null),
    view: computed(() => {
      const openDetail = detail();
      return openDetail ? buildAdDetailView(openDetail) : null;
    }),
  })),
  withMethods((store, repository = inject(AdRepository)) => ({
    loadDetail: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, { detail: null });
          store.setLoading();
        }),
        switchMap((id) =>
          repository.getAdDetail(id).pipe(
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
      patchState(store, { openAdId: id });
      store.loadDetail(id);
    },
    reload(): void {
      const id = store.openAdId();
      if (id) {
        store.loadDetail(id);
      }
    },
    close(): void {
      patchState(store, initialState);
    },
  })),
);
