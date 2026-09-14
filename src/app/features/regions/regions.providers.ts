import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AreaHttpRepository } from './data/area-http.repository';
import { AreaMockRepository } from './data/area-mock.repository';
import { AreaRepository } from './data/area.repository';
import { GovernorateHttpRepository } from './data/governorate-http.repository';
import { GovernorateMockRepository } from './data/governorate-mock.repository';
import { GovernorateRepository } from './data/governorate.repository';
import { RegionMockDatabase } from './data/region-mock-database';
import { REGION_MOCK_SEED } from './data/region-mock-seed';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideRegionsFeature(): EnvironmentProviders {
  if (!environment.useMockApi) {
    return makeEnvironmentProviders([
      { provide: GovernorateRepository, useClass: GovernorateHttpRepository },
      { provide: AreaRepository, useClass: AreaHttpRepository },
    ]);
  }
  return makeEnvironmentProviders([
    { provide: RegionMockDatabase, useFactory: () => new RegionMockDatabase(REGION_MOCK_SEED) },
    { provide: GovernorateRepository, useClass: GovernorateMockRepository },
    { provide: AreaRepository, useClass: AreaMockRepository },
  ]);
}
