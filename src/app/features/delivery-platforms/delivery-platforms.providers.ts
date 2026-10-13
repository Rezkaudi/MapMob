import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { DeliveryPlatformHttpRepository } from './data/delivery-platform-http.repository';
import { DeliveryPlatformMockRepository } from './data/delivery-platform-mock.repository';
import { DeliveryPlatformRepository } from './data/delivery-platform.repository';

/** ⚠ The mock branch is temporary — delete it and the mock files once the API exists. */
export function provideDeliveryPlatformsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DeliveryPlatformRepository,
      useClass: isMockApiUsed('delivery-platforms')
        ? DeliveryPlatformMockRepository
        : DeliveryPlatformHttpRepository,
    },
  ]);
}
