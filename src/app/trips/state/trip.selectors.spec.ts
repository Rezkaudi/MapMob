import { selectAllTrips, selectTotalDistanceInKm, selectTripError, selectTripsLoading } from './trip.selectors';
import { TripState } from './trip.state';
import { Trip } from '../trip';

const trips: readonly Trip[] = [
  { id: '1', startedAt: '2026-09-04T08:00:00Z', distanceInKm: 12.5 },
  { id: '2', startedAt: '2026-09-04T09:00:00Z', distanceInKm: 7.5 },
];

const state: TripState = { trips, isLoading: true, error: 'Network down' };

describe('trip selectors', () => {
  it('gives every trip', () => {
    expect(selectAllTrips.projector(state)).toEqual(trips);
  });

  it('adds up the distance of every trip', () => {
    expect(selectTotalDistanceInKm.projector(trips)).toBe(20);
  });

  it('gives the loading flag', () => {
    expect(selectTripsLoading.projector(state)).toBe(true);
  });

  it('gives the error message', () => {
    expect(selectTripError.projector(state)).toBe('Network down');
  });
});
