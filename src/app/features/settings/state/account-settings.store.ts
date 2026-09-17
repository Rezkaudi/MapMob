import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { AccountRepository } from '../data/account.repository';
import { AccountForm } from '../models/account-form';
import { AccountProfile } from '../models/account-profile';
import { AccountProfileDraft } from '../models/account-profile-draft';
import { PasswordChange } from '../models/password-change';
import { withFormSaveStatus } from './with-form-save-status';

interface AccountSettingsState {
  readonly profile: AccountProfile | null;
}

const initialState: AccountSettingsState = { profile: null };

export const AccountSettingsStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withFormSaveStatus<AccountForm>(),
  withComputed((store) => ({
    isSavingProfile: computed(() => store.isFormSaving('profile')),
    isChangingPassword: computed(() => store.isFormSaving('password')),
  })),
  withMethods((store, repository = inject(AccountRepository)) => ({
    loadProfile: rxMethod<void>(
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
    saveProfile(draft: AccountProfileDraft): Promise<boolean> {
      const request = repository
        .updateProfile(draft)
        .pipe(tap((profile) => patchState(store, { profile })));
      return store.saveForm('profile', request);
    },
    changePassword(change: PasswordChange): Promise<boolean> {
      return store.saveForm('password', repository.changePassword(change));
    },
  })),
);
