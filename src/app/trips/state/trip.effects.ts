import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TripApi } from '../trip-api';
import { loadTrips, loadTripsFailure, loadTripsSuccess } from './trip.actions';

@Injectable()
export class TripEffects {
  private readonly actions$ = inject(Actions);
  private readonly tripApi = inject(TripApi);

  readonly loadTrips$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTrips),
      switchMap(() =>
        this.tripApi.getTrips().pipe(
          map((trips) => loadTripsSuccess({ trips })),
          catchError((error: Error) => of(loadTripsFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
