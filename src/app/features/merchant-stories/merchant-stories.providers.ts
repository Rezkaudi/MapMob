import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MerchantStoriesHttpRepository } from './data/merchant-stories-http.repository';
import { MerchantStoriesMockRepository } from './data/merchant-stories-mock.repository';
import { MerchantStoriesRepository } from './data/merchant-stories.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantStoriesFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MerchantStoriesRepository,
      useClass: environment.useMockApi
        ? MerchantStoriesMockRepository
        : MerchantStoriesHttpRepository,
    },
  ]);
}
