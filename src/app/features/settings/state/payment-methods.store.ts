import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { PaymentMethodsRepository } from '../data/payment-methods.repository';
import { PaymentMethod } from '../models/payment-method';
import { PaymentMethodDialogState } from '../models/payment-method-dialog-state';
import { PaymentMethodDraft } from '../models/payment-method-draft';

interface PaymentMethodsState {
  readonly methods: readonly PaymentMethod[];
  readonly dialog: PaymentMethodDialogState | null;
  /** Which kind of save the confirmation toast talks about. */
  readonly savedMode: PaymentMethodDialogState['mode'] | null;
}

const initialState: PaymentMethodsState = { methods: [], dialog: null, savedMode: null };

export const PaymentMethodsStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withComputed(({ methods, isLoading }) => ({
    hasNoMethods: computed(() => !isLoading() && methods().length === 0),
  })),
  withMethods((store, repository = inject(PaymentMethodsRepository)) => {
    const requestSave = (dialog: PaymentMethodDialogState, draft: PaymentMethodDraft) =>
      dialog.mode === 'add'
        ? repository
            .addMethod(draft)
            .pipe(tap((added) => patchState(store, { methods: [...store.methods(), added] })))
        : repository.updateMethod(dialog.method.id, draft).pipe(
            tap((saved) =>
              patchState(store, {
                methods: store.methods().map((method) => (method.id === saved.id ? saved : method)),
              }),
            ),
          );

    return {
      loadMethods: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getMethods().pipe(
              tap((methods) => {
                patchState(store, { methods });
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
      openAddDialog(): void {
        patchState(store, { dialog: { mode: 'add' }, savedMode: null });
      },
      openEditDialog(method: PaymentMethod): void {
        patchState(store, { dialog: { mode: 'edit', method }, savedMode: null });
      },
      closeDialog(): void {
        patchState(store, { dialog: null });
        store.clearSaveError();
      },
      dismissSavedNotice(): void {
        patchState(store, { savedMode: null });
      },
      async saveMethod(draft: PaymentMethodDraft): Promise<boolean> {
        const dialog = store.dialog();
        if (!dialog) {
          return false;
        }
        const isSaved = await store.runSave(requestSave(dialog, draft));
        if (isSaved) {
          patchState(store, { dialog: null, savedMode: dialog.mode });
        }
        return isSaved;
      },
    };
  }),
);
