import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { PaymentRepository } from '../data/payment.repository';
import { Payment } from '../models/payment';
import { PaymentCurrency } from '../models/payment-currency';

interface EditPaymentState {
  /** The payment being edited; `null` while the dialog is closed. */
  readonly payment: Payment | null;
  readonly amount: number;
  readonly currency: PaymentCurrency;
  readonly paidAt: string;
  readonly notes: string;
  readonly isSaving: boolean;
  readonly saveError: string | null;
}

const initialState: EditPaymentState = {
  payment: null,
  amount: 0,
  currency: 'SYP',
  paidAt: '',
  notes: '',
  isSaving: false,
  saveError: null,
};

/** Everything the "تعديل الدفعة" dialog holds while the admin changes a payment. */
export const EditPaymentStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    isOpen: computed(() => store.payment() !== null),
    companyName: computed(() => store.payment()?.companyName ?? ''),
    transactionNumber: computed(() => store.payment()?.transactionNumber ?? ''),
    canSubmit: computed(() => !store.isSaving() && store.amount() > 0 && store.paidAt() !== ''),
  })),
  withMethods((store, repository = inject(PaymentRepository)) => ({
    open(payment: Payment): void {
      const { amount, currency, paidAt, notes } = payment;
      patchState(store, { ...initialState, payment, amount, currency, paidAt, notes });
    },
    close(): void {
      patchState(store, initialState);
    },
    setAmount(amount: number): void {
      patchState(store, { amount });
    },
    setCurrency(currency: PaymentCurrency): void {
      patchState(store, { currency });
    },
    setPaidAt(paidAt: string): void {
      patchState(store, { paidAt });
    },
    setNotes(notes: string): void {
      patchState(store, { notes });
    },
    async submit(): Promise<void> {
      const payment = store.payment();
      if (!payment || !store.canSubmit()) {
        return;
      }
      patchState(store, { isSaving: true, saveError: null });
      const { amount, currency, paidAt, notes } = store;
      try {
        await firstValueFrom(
          repository.updatePayment(payment.id, {
            amount: amount(),
            currency: currency(),
            paidAt: paidAt(),
            notes: notes(),
          }),
        );
        patchState(store, initialState);
      } catch (error) {
        patchState(store, { isSaving: false, saveError: (error as Error).message });
      }
    },
  })),
);
