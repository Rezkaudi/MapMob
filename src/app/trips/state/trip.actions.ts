import { createAction, props } from '@ngrx/store';
import { Trip } from '../trip';

export const loadTrips = createAction('[Trips] Load Trips');

export const loadTripsSuccess = createAction(
  '[Trips] Load Trips Success',
  props<{ trips: readonly Trip[] }>(),
);

export const loadTripsFailure = createAction(
  '[Trips] Load Trips Failure',
  props<{ error: string }>(),
);
