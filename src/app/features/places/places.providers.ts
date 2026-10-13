import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { PlaceHttpRepository } from './data/place-http.repository';
import { PlaceMockDatabase } from './data/place-mock-database';
import { buildPlaceSeed } from './data/place-mock-seed';
import { PlaceMockRepository } from './data/place-mock.repository';
import { PlaceRepository } from './data/place.repository';

/** ⚠ The mock branch is temporary — delete it and the mock files once the API exists. */
export function providePlacesFeature(): EnvironmentProviders {
  if (!isMockApiUsed('places')) {
    return makeEnvironmentProviders([{ provide: PlaceRepository, useClass: PlaceHttpRepository }]);
  }
  return makeEnvironmentProviders([
    { provide: PlaceMockDatabase, useFactory: () => new PlaceMockDatabase(buildPlaceSeed()) },
    { provide: PlaceRepository, useClass: PlaceMockRepository },
  ]);
}
