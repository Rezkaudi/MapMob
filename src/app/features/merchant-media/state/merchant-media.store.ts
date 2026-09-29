import { inject } from '@angular/core';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { MerchantMediaRepository } from '../data/merchant-media.repository';
import { withMediaDialogs } from './with-media-dialogs';
import { withMediaLibrary } from './with-media-library';

/** The merchant's "الصور و الوسائط" page. */
export const MerchantMediaStore = signalStore(
  withMediaLibrary(),
  withMediaDialogs(),
  withMethods((store, repository = inject(MerchantMediaRepository)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getLibrary().pipe(
            tap((library) => {
              patchState(store, { library });
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
