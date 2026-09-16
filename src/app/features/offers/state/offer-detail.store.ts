import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { OfferRepository } from '../data/offer.repository';
import { OfferDetail } from '../models/offer-detail';
import { buildOfferDetailView } from './offer-detail-view';

interface OfferDetailState {
  readonly openOfferId: string | null;
  readonly detail: OfferDetail | null;
}

const initialState: OfferDetailState = { openOfferId: null, detail: null };

/** The offer the side drawer shows, if any. */
export const OfferDetailStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ openOfferId, detail }) => ({
    isOpen: computed(() => openOfferId() !== null),
    view: computed(() => {
      const openDetail = detail();
      return openDetail ? buildOfferDetailView(openDetail) : null;
    }),
  })),
  withMethods((store, repository = inject(OfferRepository)) => ({
    loadDetail: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, { detail: null });
          store.setLoading();
        }),
        switchMap((id) =>
          repository.getOfferDetail(id).pipe(
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
      patchState(store, { openOfferId: id });
      store.loadDetail(id);
    },
    reload(): void {
      const id = store.openOfferId();
      if (id) {
        store.loadDetail(id);
      }
    },
    close(): void {
      patchState(store, initialState);
    },
  })),
);
