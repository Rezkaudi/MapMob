import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { Credentials } from '../../auth/models/credentials';
import { AuthStore } from '../../auth/state/auth.store';
import { MerchantAuthRepository } from '../data/merchant-auth.repository';
import { PasswordResetStep } from '../models/password-reset-step';

interface MerchantAuthState {
  readonly resetStep: PasswordResetStep;
  readonly resetEmail: string | null;
  readonly resetToken: string | null;
}

const initialState: MerchantAuthState = {
  resetStep: 'email',
  resetEmail: null,
  resetToken: null,
};

/** Kept at the root because "forgot password" spans three routes. */
export const MerchantAuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withMethods((store) => ({
    /** Runs one request with the shared loading/error status around it. */
    runRequest<TResult>(request: Observable<TResult>, onSuccess: (result: TResult) => void) {
      store.setLoading();
      return request.pipe(
        tap((result) => {
          onSuccess(result);
          store.setLoaded();
        }),
        catchError((error: Error) => {
          store.setError(error.message);
          return of(null);
        }),
      );
    },
  })),
  withMethods(
    (store, repository = inject(MerchantAuthRepository), authStore = inject(AuthStore)) => ({
      signIn: rxMethod<Credentials>(
        pipe(
          switchMap((credentials) =>
            store.runRequest(repository.signIn(credentials), (user) =>
              authStore.startSession(user),
            ),
          ),
        ),
      ),
      sendResetCode: rxMethod<string>(
        pipe(
          switchMap((email) =>
            store.runRequest(repository.sendResetCode(email), () =>
              patchState(store, { resetStep: 'code', resetEmail: email }),
            ),
          ),
        ),
      ),
      verifyResetCode: rxMethod<string>(
        pipe(
          switchMap((code) =>
            store.runRequest(
              repository.verifyResetCode({ email: store.resetEmail() ?? '', code }),
              ({ resetToken }) => patchState(store, { resetStep: 'password', resetToken }),
            ),
          ),
        ),
      ),
      resetPassword: rxMethod<string>(
        pipe(
          switchMap((password) =>
            store.runRequest(
              repository.resetPassword({ resetToken: store.resetToken() ?? '', password }),
              () => patchState(store, { resetStep: 'done', resetToken: null }),
            ),
          ),
        ),
      ),
      startReset(): void {
        patchState(store, initialState, { isLoading: false, error: null });
      },
    }),
  ),
  withMethods((store) => ({
    resendResetCode(): void {
      const email = store.resetEmail();
      if (email) {
        store.sendResetCode(email);
      }
    },
  })),
);
