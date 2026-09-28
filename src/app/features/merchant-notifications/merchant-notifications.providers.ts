import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OwnerNotificationsHttpRepository } from './data/owner-notifications-http.repository';
import { OwnerNotificationsMockRepository } from './data/owner-notifications-mock.repository';
import { OwnerNotificationsRepository } from './data/owner-notifications.repository';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideMerchantNotificationsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: OwnerNotificationsRepository,
      useClass: environment.useMockApi
        ? OwnerNotificationsMockRepository
        : OwnerNotificationsHttpRepository,
    },
  ]);
}
