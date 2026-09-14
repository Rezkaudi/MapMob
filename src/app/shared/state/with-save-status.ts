import { signalStoreFeature, withState, withMethods, patchState } from '@ngrx/signals';
import { Observable, lastValueFrom } from 'rxjs';

export interface SaveStatusState {
  readonly isSaving: boolean;
  readonly saveError: string | null;
}

const initialSaveStatusState: SaveStatusState = {
  isSaving: false,
  saveError: null,
};

export function withSaveStatus() {
  return signalStoreFeature(
    withState(initialSaveStatusState),
    withMethods((store) => ({
      /** Resolves `true` once the write succeeds, so the caller can close its dialog. */
      async runSave(request: Observable<unknown>): Promise<boolean> {
        patchState(store, { isSaving: true, saveError: null });
        try {
          await lastValueFrom(request, { defaultValue: null });
          patchState(store, { isSaving: false });
          return true;
        } catch (error) {
          patchState(store, { isSaving: false, saveError: (error as Error).message });
          return false;
        }
      },
      clearSaveError(): void {
        patchState(store, { saveError: null });
      },
    })),
  );
}
