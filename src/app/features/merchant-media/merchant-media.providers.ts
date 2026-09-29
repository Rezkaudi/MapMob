import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MerchantMediaHttpRepository } from './data/merchant-media-http.repository';
import { MerchantMediaMockRepository } from './data/merchant-media-mock.repository';
import { MerchantMediaRepository } from './data/merchant-media.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantMediaFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MerchantMediaRepository,
      useClass: environment.useMockApi ? MerchantMediaMockRepository : MerchantMediaHttpRepository,
    },
  ]);
}
