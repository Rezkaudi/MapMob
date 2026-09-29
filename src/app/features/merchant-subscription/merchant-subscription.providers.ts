import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MerchantSubscriptionHttpRepository } from './data/merchant-subscription-http.repository';
import { MerchantSubscriptionMockRepository } from './data/merchant-subscription-mock.repository';
import { MerchantSubscriptionRepository } from './data/merchant-subscription.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantSubscriptionFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MerchantSubscriptionRepository,
      useClass: environment.useMockApi
        ? MerchantSubscriptionMockRepository
        : MerchantSubscriptionHttpRepository,
    },
  ]);
}
