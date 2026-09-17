import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Observable } from 'rxjs';
import { withSaveStatus } from '../../../shared/state/with-save-status';

interface FormSaveState<TForm extends string> {
  readonly activeForm: TForm | null;
  readonly savedForm: TForm | null;
}

/** Save status for a page of cards that each save on their own, e.g. the platform tab. */
export function withFormSaveStatus<TForm extends string>() {
  const initialState: FormSaveState<TForm> = { activeForm: null, savedForm: null };

  return signalStoreFeature(
    withSaveStatus(),
    withState(initialState),
    withComputed(({ activeForm, saveError }) => ({
      failedForm: computed(() => (saveError() ? activeForm() : null)),
    })),
    withMethods((store) => ({
      async saveForm(form: TForm, request: Observable<unknown>): Promise<boolean> {
        patchState(store, { activeForm: form, savedForm: null });
        const isSaved = await store.runSave(request);
        if (isSaved) {
          patchState(store, { savedForm: form });
        }
        return isSaved;
      },
      isFormSaving(form: TForm): boolean {
        return store.isSaving() && store.activeForm() === form;
      },
      dismissSavedNotice(): void {
        patchState(store, { savedForm: null });
      },
    })),
  );
}
