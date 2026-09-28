import { Signal, computed, inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Observable, tap } from 'rxjs';
import { campaignPauseActionFor } from '../../../shared/state/campaign-pause-action';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { buildOfferDeleteCopy } from '../../../shared/ui/confirm-action-dialog/offer-delete-copy';
import { MerchantOfferRepository } from '../data/merchant-offer.repository';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferDetail } from '../models/merchant-offer-detail';
import { OfferDialogRequest } from '../models/offer-dialog-request';
import { describeOfferScope } from './offer-scope-text';

/** What the dialogs need from the catalog feature they sit on. */
type CatalogOffers = { offers: Signal<readonly MerchantOffer[]> };
type CatalogEditing = {
  replaceInCatalog(offer: MerchantOffer): void;
  removeFromCatalog(id: string): void;
};

/** The detail drawer with its pause and resume, and the delete question. */
export function withOfferDialogs() {
  return signalStoreFeature(
    { props: type<CatalogOffers>(), methods: type<CatalogEditing>() },
    withState<{ readonly dialog: OfferDialogRequest | null; readonly detailId: string | null }>({
      dialog: null,
      detailId: null,
    }),
    withSaveStatus(),
    withComputed(({ dialog, detailId, offers }) => ({
      detail: computed<MerchantOfferDetail | null>(() => {
        const offer = offers().find((candidate) => candidate.id === detailId());
        if (!offer) {
          return null;
        }
        return {
          offer,
          scopeText: describeOfferScope(offer),
          pauseAction: campaignPauseActionFor(offer.status),
        };
      }),
      deleteCopy: computed(() => {
        const request = dialog();
        return request?.kind === 'delete' ? buildOfferDeleteCopy(request.offer.title) : null;
      }),
    })),
    withMethods((store, repository = inject(MerchantOfferRepository)) => {
      const saveOpenOffer = async (change: (id: string) => Observable<MerchantOffer>) => {
        const id = store.detailId();
        if (id) {
          await store.runSave(change(id).pipe(tap((saved) => store.replaceInCatalog(saved))));
        }
      };
      return {
        openDetails(offerId: string): void {
          patchState(store, { detailId: offerId });
        },
        openDelete(offer: MerchantOffer): void {
          patchState(store, { dialog: { kind: 'delete', offer } });
        },
        closeDialog(): void {
          if (store.dialog()) {
            patchState(store, { dialog: null });
          } else {
            patchState(store, { detailId: null });
          }
          store.clearSaveError();
        },
        pauseOpenOffer(): Promise<void> {
          return saveOpenOffer((id) => repository.pauseOffer(id));
        },
        resumeOpenOffer(): Promise<void> {
          return saveOpenOffer((id) => repository.resumeOffer(id));
        },
        async confirmDelete(): Promise<void> {
          const request = store.dialog();
          if (request?.kind !== 'delete') {
            return;
          }
          const { id } = request.offer;
          const remove = repository.deleteOffer(id).pipe(tap(() => store.removeFromCatalog(id)));
          if (await store.runSave(remove)) {
            patchState(store, {
              dialog: null,
              detailId: store.detailId() === id ? null : store.detailId(),
            });
          }
        },
      };
    }),
  );
}
