import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { MerchantMediaHttpRepository } from './data/merchant-media-http.repository';
import { MerchantMediaMockRepository } from './data/merchant-media-mock.repository';
import { MerchantMediaRepository } from './data/merchant-media.repository';

/** ⚠ The mock branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantMediaFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MerchantMediaRepository,
      useClass: isMockApiUsed('merchant-media')
        ? MerchantMediaMockRepository
        : MerchantMediaHttpRepository,
    },
  ]);
}
