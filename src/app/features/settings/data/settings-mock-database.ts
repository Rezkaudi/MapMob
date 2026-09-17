import { AccountProfile } from '../models/account-profile';
import { AdminRole } from '../models/admin-role';
import { DashboardAdmin } from '../models/dashboard-admin';
import { NotificationAlert } from '../models/notification-alert';
import { PaymentMethod } from '../models/payment-method';
import { PlatformSettings } from '../models/platform-settings';
import { AccountMockRecords } from './account-mock-records';
import { AdminTeamMockRecords } from './admin-team-mock-records';
import { NotificationAlertMockRecords } from './notification-alert-mock-records';
import { PaymentMethodMockRecords } from './payment-method-mock-records';
import { PlatformMockRecords } from './platform-mock-records';

export interface SettingsMockSeed {
  readonly account: AccountProfile;
  readonly accountPassword: string;
  readonly platform: PlatformSettings;
  readonly notificationAlerts: readonly NotificationAlert[];
  readonly paymentMethods: readonly PaymentMethod[];
  readonly roles: readonly AdminRole[];
  readonly admins: readonly DashboardAdmin[];
}

/** In-memory records behind the settings mock repositories, so saves stick until the page reloads. */
export class SettingsMockDatabase {
  readonly account: AccountMockRecords;
  readonly platform: PlatformMockRecords;
  readonly notificationAlerts: NotificationAlertMockRecords;
  readonly paymentMethods: PaymentMethodMockRecords;
  readonly team: AdminTeamMockRecords;

  constructor(seed: SettingsMockSeed) {
    this.account = new AccountMockRecords(seed.account, seed.accountPassword);
    this.platform = new PlatformMockRecords(seed.platform);
    this.notificationAlerts = new NotificationAlertMockRecords(seed.notificationAlerts);
    this.paymentMethods = new PaymentMethodMockRecords(seed.paymentMethods);
    this.team = new AdminTeamMockRecords(seed.roles, seed.admins);
  }
}
