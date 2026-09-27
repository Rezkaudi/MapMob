import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { AdRepository } from '../data/ad.repository';
import { AdDetail } from '../models/ad-detail';
import { buildAdDetailView } from './ad-detail-view';

interface AdDetailState {
  readonly adId: string | null;
  readonly detail: AdDetail | null;
}

const initialState: AdDetailState = { adId: null, detail: null };

/** The one ad the detail page is showing. */
export const AdDetailStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ detail }) => ({
    view: computed(() => {
      const loaded = detail();
      return loaded ? buildAdDetailView(loaded) : null;
    }),
  })),
  withMethods((store, repository = inject(AdRepository)) => ({
    loadAd: rxMethod<string>(
      pipe(
        tap((id) => {
          patchState(store, { adId: id, detail: null });
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
    reload(): void {
      const id = store.adId();
      if (id) {
        store.loadAd(id);
      }
    },
  })),
);
