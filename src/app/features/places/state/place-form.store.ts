import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, lastValueFrom, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { PlaceRepository } from '../data/place.repository';
import { PlaceDetail } from '../models/place-detail';
import { PlaceFormChoices } from '../models/place-form-choices';
import { PlaceSaveRequest } from '../models/place-save-request';

interface PlaceFormState {
  readonly editingId: string | null;
  readonly editedPlace: PlaceDetail | null;
  readonly choices: PlaceFormChoices | null;
  readonly isSaving: boolean;
  readonly saveError: string | null;
}

const initialState: PlaceFormState = {
  editingId: null,
  editedPlace: null,
  choices: null,
  isSaving: false,
  saveError: null,
};

/** What the add and edit place pages load and save. */
export const PlaceFormStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ editingId, editedPlace, choices, isLoading, error }) => ({
    isReady: computed(
      () =>
        !isLoading() &&
        error() === null &&
        choices() !== null &&
        (editingId() === null || editedPlace() !== null),
    ),
  })),
  withMethods((store, repository = inject(PlaceRepository)) => ({
    load: rxMethod<string | null>(
      pipe(
        tap((editingId) => {
          patchState(store, { editingId, editedPlace: null });
          store.setLoading();
        }),
        switchMap((editingId) =>
          forkJoin({
            choices: repository.getPlaceFormChoices(),
            editedPlace: editingId ? repository.getPlace(editingId) : of(null),
          }).pipe(
            tap(({ choices, editedPlace }) => {
              patchState(store, { choices, editedPlace });
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
    /** Resolves the saved place's id, or `null` when the save failed and `saveError` says why. */
    async save(id: string | null, request: PlaceSaveRequest): Promise<string | null> {
      patchState(store, { isSaving: true, saveError: null });
      try {
        return await lastValueFrom(repository.savePlace(id, request));
      } catch (error) {
        patchState(store, { saveError: (error as Error).message });
        return null;
      } finally {
        patchState(store, { isSaving: false });
      }
    },
    clearSaveError(): void {
      patchState(store, { saveError: null });
    },
  })),
  withMethods((store) => ({
    retry(): void {
      store.load(store.editingId());
    },
  })),
);
