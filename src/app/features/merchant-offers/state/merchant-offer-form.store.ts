import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { OfferDraftFields } from '../../../shared/models/offer-draft-fields';
import { OfferItem } from '../../../shared/models/offer-item';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { MerchantOfferRepository } from '../data/merchant-offer.repository';
import { MerchantOffer } from '../models/merchant-offer';

interface MerchantOfferFormState {
  readonly editingId: string | null;
  readonly editedOffer: MerchantOffer | null;
  readonly items: readonly OfferItem[];
  readonly isLoaded: boolean;
}

const initialState: MerchantOfferFormState = {
  editingId: null,
  editedOffer: null,
  items: [],
  isLoaded: false,
};

/** What the owner's add and edit pages load and save. */
export const MerchantOfferFormStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withComputed(({ isLoaded, isLoading }) => ({
    isReady: computed(() => isLoaded() && !isLoading()),
  })),
  withMethods((store, repository = inject(MerchantOfferRepository)) => ({
    load: rxMethod<string | null>(
      pipe(
        tap((editingId) => {
          patchState(store, { editingId, editedOffer: null, isLoaded: false });
          store.setLoading();
        }),
        switchMap((editingId) =>
          forkJoin({
            items: repository.getItems(),
            offer: editingId ? repository.getOffer(editingId) : of(null),
          }).pipe(
            tap(({ items, offer }) => {
              patchState(store, { items, editedOffer: offer, isLoaded: true });
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
  withMethods((store, repository = inject(MerchantOfferRepository)) => ({
    retry(): void {
      store.load(store.editingId());
    },
    save(draft: OfferDraftFields): Promise<boolean> {
      const editingId = store.editingId();
      return store.runSave(
        editingId ? repository.updateOffer(editingId, draft) : repository.createOffer(draft),
      );
    },
  })),
);
