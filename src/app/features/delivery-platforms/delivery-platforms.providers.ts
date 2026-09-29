import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DeliveryPlatformHttpRepository } from './data/delivery-platform-http.repository';
import { DeliveryPlatformMockRepository } from './data/delivery-platform-mock.repository';
import { DeliveryPlatformRepository } from './data/delivery-platform.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideDeliveryPlatformsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DeliveryPlatformRepository,
      useClass: environment.useMockApi
        ? DeliveryPlatformMockRepository
        : DeliveryPlatformHttpRepository,
    },
  ]);
}
