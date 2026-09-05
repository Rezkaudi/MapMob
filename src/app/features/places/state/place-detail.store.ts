import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
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
);
