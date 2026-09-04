import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PlaceHttpRepository } from './data/place-http.repository';
import { PlaceMockRepository } from './data/place-mock.repository';
import { PlaceRepository } from './data/place.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and PlaceMockRepository once the API exists. */
export function providePlacesFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: PlaceRepository,
      useClass: environment.useMockApi ? PlaceMockRepository : PlaceHttpRepository,
    },
  ]);
}
