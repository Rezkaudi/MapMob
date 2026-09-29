import { inject } from '@angular/core';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { MerchantSubscriptionRepository } from '../data/merchant-subscription.repository';
import { withSubscriptionDialogs } from './with-subscription-dialogs';
import { withSubscriptionOverview } from './with-subscription-overview';

/** The merchant's "الاشتراكات و الباقات" page. */
export const MerchantSubscriptionStore = signalStore(
  withSubscriptionOverview(),
  withSubscriptionDialogs(),
  withMethods((store, repository = inject(MerchantSubscriptionRepository)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getOverview().pipe(
            tap((overview) => {
              patchState(store, { overview });
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
