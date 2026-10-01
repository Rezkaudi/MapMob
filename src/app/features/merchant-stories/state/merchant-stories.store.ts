import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { MerchantStoriesRepository } from '../data/merchant-stories.repository';
import { withStoryDialogs } from './with-story-dialogs';
import { withStoryLibrary } from './with-story-library';

/** The merchant's "القصص" page. */
export const MerchantStoriesStore = signalStore(
  withStoryLibrary(),
  withStoryDialogs(),
  withMethods((store, repository = inject(MerchantStoriesRepository)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getLibrary().pipe(
            tap((library) => {
              store.showLibrary(library);
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
