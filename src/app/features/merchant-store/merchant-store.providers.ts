import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StoreProfileHttpRepository } from './data/store-profile-http.repository';
import { StoreProfileMockRepository } from './data/store-profile-mock.repository';
import { StoreProfileRepository } from './data/store-profile.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantStoreFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: StoreProfileRepository,
      useClass: environment.useMockApi ? StoreProfileMockRepository : StoreProfileHttpRepository,
    },
  ]);
}
