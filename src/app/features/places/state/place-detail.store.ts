import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, pipe, switchMap, tap, catchError, of } from 'rxjs';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { PlaceRepository } from '../data/place.repository';
import { PlaceDetail } from '../models/place-detail';

interface PlaceDetailState {
  readonly place: PlaceDetail | null;
}

const initialState: PlaceDetailState = { place: null };

export const PlaceDetailStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withMethods((store, repository = inject(PlaceRepository)) => ({
    loadPlace: rxMethod<string>(
      pipe(
        tap(() => store.setLoading()),
        switchMap((id) =>
          repository.getPlace(id).pipe(
            tap((place) => {
              patchState(store, { place });
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
  withMethods((store, repository = inject(PlaceRepository)) => {
    const save = async (request: Observable<unknown>, id: string, isReloaded: boolean) => {
      const isSaved = await store.runSave(request);
      if (isSaved && isReloaded) {
        store.loadPlace(id);
      }
      return isSaved;
    };

    return {
      changeStatus(id: string, status: ActivationStatus): Promise<boolean> {
        return save(repository.setPlacesStatus([id], status), id, true);
      },
      /** The page leaves for the list once this resolves, so there is nothing to reload. */
      deletePlace(id: string): Promise<boolean> {
        return save(repository.deletePlaces([id]), id, false);
      },
    };
  }),
);
