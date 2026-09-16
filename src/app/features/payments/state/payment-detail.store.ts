import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { PaymentRepository } from '../data/payment.repository';
import { PaymentDetail } from '../models/payment-detail';

interface PaymentDetailState {
  readonly openPaymentId: string | null;
  readonly detail: PaymentDetail | null;
}

const initialState: PaymentDetailState = { openPaymentId: null, detail: null };

/** The payment the detail dialog shows, if any. */
export const PaymentDetailStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ openPaymentId }) => ({
    isOpen: computed(() => openPaymentId() !== null),
  })),
  withMethods((store, repository = inject(PaymentRepository)) => ({
    loadDetail: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, { detail: null });
          store.setLoading();
        }),
        switchMap((id) =>
          repository.getPaymentDetail(id).pipe(
            tap((detail) => {
              patchState(store, { detail });
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
  withMethods((store) => ({
    open(id: string): void {
      patchState(store, { openPaymentId: id });
      store.loadDetail(id);
    },
    reload(): void {
      const id = store.openPaymentId();
      if (id) {
        store.loadDetail(id);
      }
    },
    close(): void {
      patchState(store, initialState);
    },
  })),
);
