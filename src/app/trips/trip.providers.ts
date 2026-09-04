import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { TRIP_FEATURE_KEY } from './state/trip.state';
import { tripReducer } from './state/trip.reducer';
import { TripEffects } from './state/trip.effects';

export function provideTripsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(TRIP_FEATURE_KEY, tripReducer),
    provideEffects(TripEffects),
  ]);
}
