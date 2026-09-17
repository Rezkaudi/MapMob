import { SettingsMockSeed } from '../data/settings-mock-database';
import {
  buildAccountProfile,
  buildAdminRole,
  buildDashboardAdmin,
  buildNotificationAlerts,
  buildPaymentMethod,
  buildPlatformSettings,
} from './settings-fixture';

export function buildSettingsMockSeed(): SettingsMockSeed {
  return {
    account: buildAccountProfile(),
    accountPassword: 'currentPass123',
    platform: buildPlatformSettings(),
    notificationAlerts: buildNotificationAlerts(),
    paymentMethods: [buildPaymentMethod()],
    roles: [
      buildAdminRole({ id: 'role-1', name: 'مدير النظام', isFullAccess: true, adminCount: 0 }),
      buildAdminRole({ adminCount: 0 }),
    ],
    admins: [
      buildDashboardAdmin({ id: 'admin-1', roleId: 'role-1', roleName: 'مدير النظام' }),
      buildDashboardAdmin(),
      buildDashboardAdmin({ id: 'admin-3', email: 'yousef@mapmob.com' }),
    ],
  };
}
