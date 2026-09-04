import { tripReducer } from './trip.reducer';
import { initialTripState } from './trip.state';
import { loadTrips, loadTripsFailure, loadTripsSuccess } from './trip.actions';
import { Trip } from '../trip';

const trip: Trip = { id: '1', startedAt: '2026-09-04T08:00:00Z', distanceInKm: 12.5 };

describe('tripReducer', () => {
  it('marks the state as loading when loading starts', () => {
    const state = tripReducer(initialTripState, loadTrips());

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('keeps the trips when loading succeeds', () => {
    const state = tripReducer(initialTripState, loadTripsSuccess({ trips: [trip] }));

    expect(state.trips).toEqual([trip]);
    expect(state.isLoading).toBe(false);
  });

  it('keeps the message when loading fails', () => {
    const state = tripReducer(initialTripState, loadTripsFailure({ error: 'Network down' }));

    expect(state.error).toBe('Network down');
    expect(state.isLoading).toBe(false);
  });
});
