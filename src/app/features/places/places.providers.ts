import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PlaceHttpRepository } from './data/place-http.repository';
import { PlaceMockDatabase } from './data/place-mock-database';
import { buildPlaceSeed } from './data/place-mock-seed';
import { PlaceMockRepository } from './data/place-mock.repository';
import { PlaceRepository } from './data/place.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function providePlacesFeature(): EnvironmentProviders {
  if (!environment.useMockApi) {
    return makeEnvironmentProviders([{ provide: PlaceRepository, useClass: PlaceHttpRepository }]);
  }
  return makeEnvironmentProviders([
    { provide: PlaceMockDatabase, useFactory: () => new PlaceMockDatabase(buildPlaceSeed()) },
    { provide: PlaceRepository, useClass: PlaceMockRepository },
  ]);
}
