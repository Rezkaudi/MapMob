import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { PlaceRepository } from '../data/place.repository';
import { PlaceDetail } from '../models/place-detail';

interface PlaceFormState {
  readonly editingId: string | null;
  readonly editedPlace: PlaceDetail | null;
}

const initialState: PlaceFormState = { editingId: null, editedPlace: null };

/** What the add and edit place pages load. */
export const PlaceFormStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withComputed(({ editingId, editedPlace, isLoading, error }) => ({
    isReady: computed(
      () => !isLoading() && error() === null && (editingId() === null || editedPlace() !== null),
    ),
  })),
  withMethods((store, repository = inject(PlaceRepository)) => ({
    load: rxMethod<string | null>(
      pipe(
        tap((editingId) => {
          patchState(store, { editingId, editedPlace: null });
          store.setLoading();
        }),
        switchMap((editingId) => {
          if (!editingId) {
            store.setLoaded();
            return of(null);
          }
          return repository.getPlace(editingId).pipe(
            tap((editedPlace) => {
              patchState(store, { editedPlace });
              store.setLoaded();
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          );
        }),
      ),
    ),
  })),
  withMethods((store) => ({
    retry(): void {
      store.load(store.editingId());
    },
  })),
);
