import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { StoreProfileRepository } from '../data/store-profile.repository';
import { StoreProfile } from '../models/store-profile';
import { StoreProfileUpdate } from '../models/store-profile-update';

interface StoreProfileState {
  readonly profile: StoreProfile | null;
  readonly isSaving: boolean;
  readonly hasSaved: boolean;
  readonly saveError: string | null;
}

const initialState: StoreProfileState = {
  profile: null,
  isSaving: false,
  hasSaved: false,
  saveError: null,
};

/** The merchant's "بيانات المتجر" page: one place to read, one save. */
export const StoreProfileStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withMethods((store, repository = inject(StoreProfileRepository)) => ({
    load: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getProfile().pipe(
            tap((profile) => {
              patchState(store, { profile });
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
    // A second press while saving is ignored rather than sent twice.
    save: rxMethod<StoreProfileUpdate>(
      pipe(
        tap(() => patchState(store, { isSaving: true, hasSaved: false, saveError: null })),
        exhaustMap((update) =>
          repository.saveProfile(update).pipe(
            tap((profile) => patchState(store, { profile, isSaving: false, hasSaved: true })),
            catchError((error: Error) => {
              patchState(store, { isSaving: false, saveError: error.message });
              return of(null);
            }),
          ),
        ),
      ),
    ),
    dismissSaveResult(): void {
      patchState(store, { hasSaved: false, saveError: null });
    },
  })),
);
