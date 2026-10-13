import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { isMockApiUsed } from '../../core/config/mock-api-switch';
import { NotificationHttpRepository } from './data/notification-http.repository';
import { NotificationMockDatabase } from './data/notification-mock-database';
import { buildNotificationSeed } from './data/notification-mock-seed';
import { NotificationMockRepository } from './data/notification-mock.repository';
import { NotificationRepository } from './data/notification.repository';

/** Enough notifications for several pages of four rows. */
const MOCK_NOTIFICATION_COUNT = 42;

/** ⚠ The mock branch is temporary — delete it and the mock files once the API exists. */
export function provideNotificationsFeature(): EnvironmentProviders {
  if (!isMockApiUsed('notifications')) {
    return makeEnvironmentProviders([
      { provide: NotificationRepository, useClass: NotificationHttpRepository },
    ]);
  }
  return makeEnvironmentProviders([
    {
      provide: NotificationMockDatabase,
      useFactory: () =>
        new NotificationMockDatabase(buildNotificationSeed(new Date(), MOCK_NOTIFICATION_COUNT)),
    },
    { provide: NotificationRepository, useClass: NotificationMockRepository },
  ]);
}
