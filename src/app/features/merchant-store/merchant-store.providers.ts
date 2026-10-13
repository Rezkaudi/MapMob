import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { StoreProfileHttpRepository } from './data/store-profile-http.repository';
import { StoreProfileMockRepository } from './data/store-profile-mock.repository';
import { StoreProfileRepository } from './data/store-profile.repository';

/** ⚠ The mock branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantStoreFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: StoreProfileRepository,
      useClass: isMockApiUsed('merchant-store')
        ? StoreProfileMockRepository
        : StoreProfileHttpRepository,
    },
  ]);
}
