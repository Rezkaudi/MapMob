import { Routes } from '@angular/router';

const loadNotificationForm = () =>
  import('./pages/notification-form/notification-form').then((m) => m.NotificationForm);

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/notification-list/notification-list').then((m) => m.NotificationList),
  },
  { path: 'new', loadComponent: loadNotificationForm },
  { path: ':id/edit', loadComponent: loadNotificationForm },
];
