import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/settings-layout/settings-layout').then((m) => m.SettingsLayout),
    children: [
      { path: '', redirectTo: 'account', pathMatch: 'full' },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/account-settings/account-settings').then((m) => m.AccountSettings),
      },
      {
        path: 'platform',
        loadComponent: () =>
          import('./pages/platform-settings/platform-settings').then((m) => m.PlatformSettingsPage),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/notification-settings/notification-settings').then(
            (m) => m.NotificationSettings,
          ),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./pages/payment-settings/payment-settings').then((m) => m.PaymentSettings),
      },
      {
        path: 'admins',
        loadComponent: () =>
          import('./pages/admin-settings/admin-settings').then((m) => m.AdminSettings),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./pages/role-settings/role-settings').then((m) => m.RoleSettings),
      },
    ],
  },
];
