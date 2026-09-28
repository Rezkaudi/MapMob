import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MerchantAuthHttpRepository } from './data/merchant-auth-http.repository';
import { MerchantAuthMockRepository } from './data/merchant-auth-mock.repository';
import { MerchantAuthRepository } from './data/merchant-auth.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantAuthFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MerchantAuthRepository,
      useClass: environment.useMockApi ? MerchantAuthMockRepository : MerchantAuthHttpRepository,
    },
  ]);
}
