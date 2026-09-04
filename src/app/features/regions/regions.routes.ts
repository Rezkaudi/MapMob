import { Routes } from '@angular/router';

export const REGIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/region-list/region-list').then((m) => m.RegionList),
  },
];
