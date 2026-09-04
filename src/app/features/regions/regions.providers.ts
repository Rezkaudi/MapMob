import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RegionHttpRepository } from './data/region-http.repository';
import { RegionMockRepository } from './data/region-mock.repository';
import { RegionRepository } from './data/region.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and RegionMockRepository once the API exists. */
export function provideRegionsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: RegionRepository,
      useClass: environment.useMockApi ? RegionMockRepository : RegionHttpRepository,
    },
  ]);
}
