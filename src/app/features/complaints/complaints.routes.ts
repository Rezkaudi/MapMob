import { Routes } from '@angular/router';

export const COMPLAINTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/complaint-list/complaint-list').then((m) => m.ComplaintList),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/complaint-detail/complaint-detail').then((m) => m.ComplaintDetailPage),
  },
];
