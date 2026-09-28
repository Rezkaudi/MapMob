import { inject } from '@angular/core';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { MerchantProductRepository } from '../data/merchant-product.repository';
import { withProductCatalog } from './with-product-catalog';
import { withProductDialogs } from './with-product-dialogs';

/** The merchant's "الخدمات و المنتجات" page. */
export const MerchantProductsStore = signalStore(
  withProductCatalog(),
  withProductDialogs(),
  withMethods((store, repository = inject(MerchantProductRepository)) => ({
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
