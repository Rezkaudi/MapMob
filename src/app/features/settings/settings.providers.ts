import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdminsHttpRepository } from './data/admins-http.repository';
import { AdminsMockRepository } from './data/admins-mock.repository';
import { AdminsRepository } from './data/admins.repository';
import { RolesHttpRepository } from './data/roles-http.repository';
import { RolesMockRepository } from './data/roles-mock.repository';
import { RolesRepository } from './data/roles.repository';
import { AccountHttpRepository } from './data/account-http.repository';
import { AccountMockRepository } from './data/account-mock.repository';
import { AccountRepository } from './data/account.repository';
import { NotificationAlertsHttpRepository } from './data/notification-alerts-http.repository';
import { NotificationAlertsMockRepository } from './data/notification-alerts-mock.repository';
import { NotificationAlertsRepository } from './data/notification-alerts.repository';
import { PaymentMethodsHttpRepository } from './data/payment-methods-http.repository';
import { PaymentMethodsMockRepository } from './data/payment-methods-mock.repository';
import { PaymentMethodsRepository } from './data/payment-methods.repository';
import { PlatformSettingsHttpRepository } from './data/platform-settings-http.repository';
import { PlatformSettingsMockRepository } from './data/platform-settings-mock.repository';
import { PlatformSettingsRepository } from './data/platform-settings.repository';
import { SettingsMockDatabaseLoader } from './data/settings-mock-database-loader';

/** ⚠ The `useMockApi` branch is temporary — delete it and the mock files once the API exists. */
export function provideSettingsFeature(): EnvironmentProviders {
  if (!environment.useMockApi) {
    return makeEnvironmentProviders([
      { provide: AccountRepository, useClass: AccountHttpRepository },
      { provide: PlatformSettingsRepository, useClass: PlatformSettingsHttpRepository },
      { provide: NotificationAlertsRepository, useClass: NotificationAlertsHttpRepository },
      { provide: PaymentMethodsRepository, useClass: PaymentMethodsHttpRepository },
      { provide: AdminsRepository, useClass: AdminsHttpRepository },
      { provide: RolesRepository, useClass: RolesHttpRepository },
    ]);
  }
  return makeEnvironmentProviders([
    SettingsMockDatabaseLoader,
    { provide: AccountRepository, useClass: AccountMockRepository },
    { provide: PlatformSettingsRepository, useClass: PlatformSettingsMockRepository },
    { provide: NotificationAlertsRepository, useClass: NotificationAlertsMockRepository },
    { provide: PaymentMethodsRepository, useClass: PaymentMethodsMockRepository },
    { provide: AdminsRepository, useClass: AdminsMockRepository },
    { provide: RolesRepository, useClass: RolesMockRepository },
  ]);
}
