import { inject } from '@angular/core';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { MerchantOfferRepository } from '../data/merchant-offer.repository';
import { withOfferCatalog } from './with-offer-catalog';
import { withOfferDialogs } from './with-offer-dialogs';

/** The merchant's "العروض" page. */
export const MerchantOffersStore = signalStore(
  withOfferCatalog(),
  withOfferDialogs(),
  withMethods((store, repository = inject(MerchantOfferRepository)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getCatalog().pipe(
            tap((catalog) => {
              patchState(store, { catalog });
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
);
