import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { AuthRepository } from '../data/auth.repository';
import { AuthStorage } from '../data/auth-storage';
import { AuthenticatedUser } from '../models/authenticated-user';
import { Credentials } from '../models/credentials';

interface AuthState {
  readonly user: AuthenticatedUser | null;
}

const initialState: AuthState = { user: null };

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withComputed(({ user }) => ({
    isSignedIn: computed(() => user() !== null),
  })),
  withHooks({
    onInit(store, storage = inject(AuthStorage)) {
      patchState(store, { user: storage.read() });
    },
  }),
  withMethods((store, repository = inject(AuthRepository), storage = inject(AuthStorage)) => ({
    signIn: rxMethod<Credentials>(
      pipe(
        tap(() => store.setLoading()),
        switchMap((credentials) =>
          repository.signIn(credentials).pipe(
            tap((user) => {
              storage.save(user);
              patchState(store, { user });
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
    signOut(): void {
      storage.clear();
      patchState(store, { user: null });
    },
  })),
);
