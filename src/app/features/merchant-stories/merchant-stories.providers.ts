import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { MerchantStoriesHttpRepository } from './data/merchant-stories-http.repository';
import { MerchantStoriesMockRepository } from './data/merchant-stories-mock.repository';
import { MerchantStoriesRepository } from './data/merchant-stories.repository';

/** ⚠ The mock branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantStoriesFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MerchantStoriesRepository,
      useClass: isMockApiUsed('merchant-stories')
        ? MerchantStoriesMockRepository
        : MerchantStoriesHttpRepository,
    },
  ]);
}
