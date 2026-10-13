import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { MerchantSubscriptionHttpRepository } from './data/merchant-subscription-http.repository';
import { MerchantSubscriptionMockRepository } from './data/merchant-subscription-mock.repository';
import { MerchantSubscriptionRepository } from './data/merchant-subscription.repository';

/** ⚠ The mock branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantSubscriptionFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MerchantSubscriptionRepository,
      useClass: isMockApiUsed('merchant-subscription')
        ? MerchantSubscriptionMockRepository
        : MerchantSubscriptionHttpRepository,
    },
  ]);
}
