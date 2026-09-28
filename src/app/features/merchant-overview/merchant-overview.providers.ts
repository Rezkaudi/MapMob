import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MerchantOverviewHttpRepository } from './data/merchant-overview-http.repository';
import { MerchantOverviewMockRepository } from './data/merchant-overview-mock.repository';
import { MerchantOverviewRepository } from './data/merchant-overview.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantOverviewFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MerchantOverviewRepository,
      useClass: environment.useMockApi
        ? MerchantOverviewMockRepository
        : MerchantOverviewHttpRepository,
    },
  ]);
}
