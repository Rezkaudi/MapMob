import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { AdRepository } from '../data/ad.repository';
import { AdDetail } from '../models/ad-detail';
import { AdDraft } from '../models/ad-draft';
import { AdFormOptions } from '../models/ad-form-options';

interface AdFormState {
  readonly editingId: string | null;
  readonly options: AdFormOptions | null;
  readonly editedDetail: AdDetail | null;
}

const initialState: AdFormState = { editingId: null, options: null, editedDetail: null };

/** What the add and edit ad pages load and save. */
export const AdFormStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withComputed(({ options, editingId, editedDetail, isLoading }) => ({
    isReady: computed(
      () => options() !== null && !isLoading() && (editingId() === null || editedDetail() !== null),
    ),
  })),
  withMethods((store, repository = inject(AdRepository)) => ({
    load: rxMethod<string | null>(
      pipe(
        tap((editingId) => {
          patchState(store, { editingId, editedDetail: null });
          store.setLoading();
        }),
        switchMap((editingId) =>
          forkJoin({
            options: repository.getFormOptions(),
            detail: editingId ? repository.getAdDetail(editingId) : of(null),
          }).pipe(
            tap(({ options, detail }) => {
              patchState(store, { options, editedDetail: detail });
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
  withMethods((store, repository = inject(AdRepository)) => ({
    retry(): void {
      store.load(store.editingId());
    },
    save(editingId: string | null, draft: AdDraft): Promise<boolean> {
      return store.runSave(
        editingId ? repository.updateAd(editingId, draft) : repository.createAd(draft),
      );
    },
  })),
);
