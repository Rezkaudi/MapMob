import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { OfferRepository } from '../data/offer.repository';
import { OfferDetail } from '../models/offer-detail';
import { OfferDraft } from '../models/offer-draft';
import { OfferFormOptions } from '../models/offer-form-options';
import { OfferItem } from '../models/offer-item';

interface OfferFormState {
  readonly editingId: string | null;
  readonly options: OfferFormOptions | null;
  readonly editedDetail: OfferDetail | null;
  readonly items: readonly OfferItem[];
  readonly isItemsLoading: boolean;
}

const initialState: OfferFormState = {
  editingId: null,
  options: null,
  editedDetail: null,
  items: [],
  isItemsLoading: false,
};

/** What the add and edit pages load and save. */
export const OfferFormStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withComputed(({ options, editingId, editedDetail, isLoading }) => ({
    isReady: computed(
      () => options() !== null && !isLoading() && (editingId() === null || editedDetail() !== null),
    ),
  })),
  withMethods((store, repository = inject(OfferRepository)) => ({
    loadItems: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { items: [] })),
        switchMap((placeId) => {
          if (!placeId) {
            return of(null);
          }
          patchState(store, { isItemsLoading: true });
          return repository.getPlaceItems(placeId).pipe(
            tap((items) => patchState(store, { items, isItemsLoading: false })),
            catchError(() => {
              patchState(store, { isItemsLoading: false });
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
  withMethods((store, repository = inject(OfferRepository)) => ({
    load: rxMethod<string | null>(
      pipe(
        tap((editingId) => {
          patchState(store, { editingId, editedDetail: null });
          store.setLoading();
        }),
        switchMap((editingId) =>
          forkJoin({
            options: repository.getFormOptions(),
            detail: editingId ? repository.getOfferDetail(editingId) : of(null),
          }).pipe(
            tap(({ options, detail }) => {
              patchState(store, { options, editedDetail: detail });
              store.setLoaded();
              if (detail) {
                store.loadItems(detail.place.id);
              }
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
  withMethods((store, repository = inject(OfferRepository)) => ({
    retry(): void {
      store.load(store.editingId());
    },
    save(editingId: string | null, draft: OfferDraft): Promise<boolean> {
      return store.runSave(
        editingId ? repository.updateOffer(editingId, draft) : repository.createOffer(draft),
      );
    },
  })),
);
