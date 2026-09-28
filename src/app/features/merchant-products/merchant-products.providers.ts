import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MerchantProductHttpRepository } from './data/merchant-product-http.repository';
import { MerchantProductMockRepository } from './data/merchant-product-mock.repository';
import { MerchantProductRepository } from './data/merchant-product.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock repository once the API exists. */
export function provideMerchantProductsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MerchantProductRepository,
      useClass: environment.useMockApi
        ? MerchantProductMockRepository
        : MerchantProductHttpRepository,
    },
  ]);
}
