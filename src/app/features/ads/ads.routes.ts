import { Routes } from '@angular/router';

const loadAdForm = () => import('./pages/ad-form/ad-form').then((m) => m.AdForm);

export const ADS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/ad-list/ad-list').then((m) => m.AdList),
  },
  { path: 'new', loadComponent: loadAdForm },
  { path: ':id/edit', loadComponent: loadAdForm },
];
