import { Routes } from '@angular/router';

export const INBOX_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/inbox/inbox').then((m) => m.InboxPage),
  },
];
