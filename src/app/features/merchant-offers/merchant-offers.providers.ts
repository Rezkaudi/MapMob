import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MerchantOfferHttpRepository } from './data/merchant-offer-http.repository';
import { MerchantOfferMockRepository } from './data/merchant-offer-mock.repository';
import { MerchantOfferRepository } from './data/merchant-offer.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantOffersFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MerchantOfferRepository,
      useClass: environment.useMockApi ? MerchantOfferMockRepository : MerchantOfferHttpRepository,
    },
  ]);
}
