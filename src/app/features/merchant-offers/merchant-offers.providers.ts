import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { MerchantOfferHttpRepository } from './data/merchant-offer-http.repository';
import { MerchantOfferMockRepository } from './data/merchant-offer-mock.repository';
import { MerchantOfferRepository } from './data/merchant-offer.repository';

/** ⚠ The mock branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantOffersFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MerchantOfferRepository,
      useClass: isMockApiUsed('merchant-offers')
        ? MerchantOfferMockRepository
        : MerchantOfferHttpRepository,
    },
  ]);
}
