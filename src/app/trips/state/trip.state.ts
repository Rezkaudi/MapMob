import { Trip } from '../trip';

export interface TripState {
  readonly trips: readonly Trip[];
  readonly isLoading: boolean;
  readonly error: string | null;
}

export const TRIP_FEATURE_KEY = 'trips';

export const initialTripState: TripState = {
  trips: [],
  isLoading: false,
  error: null,
};
