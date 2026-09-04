import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TRIP_FEATURE_KEY, TripState } from './trip.state';

const selectTripState = createFeatureSelector<TripState>(TRIP_FEATURE_KEY);

export const selectAllTrips = createSelector(selectTripState, (state) => state.trips);

export const selectTripsLoading = createSelector(selectTripState, (state) => state.isLoading);

export const selectTripError = createSelector(selectTripState, (state) => state.error);

export const selectTotalDistanceInKm = createSelector(selectAllTrips, (trips) =>
  trips.reduce((total, trip) => total + trip.distanceInKm, 0),
);
