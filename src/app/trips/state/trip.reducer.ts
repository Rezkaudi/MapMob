import { createReducer, on } from '@ngrx/store';
import { initialTripState } from './trip.state';
import { loadTrips, loadTripsFailure, loadTripsSuccess } from './trip.actions';

export const tripReducer = createReducer(
  initialTripState,
  on(loadTrips, (state) => ({ ...state, isLoading: true, error: null })),
  on(loadTripsSuccess, (state, { trips }) => ({ ...state, trips, isLoading: false })),
  on(loadTripsFailure, (state, { error }) => ({ ...state, error, isLoading: false })),
);
