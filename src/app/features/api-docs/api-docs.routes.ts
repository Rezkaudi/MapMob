import { Routes } from '@angular/router';

export const API_DOCS_ROUTES: Routes = [
  {
    path: '',
    title: 'MapMob API reference',
    loadComponent: () => import('./pages/api-docs/api-docs').then((m) => m.ApiDocsPage),
  },
];
