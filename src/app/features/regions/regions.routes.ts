import { Routes } from '@angular/router';

export const REGIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/governorate-list/governorate-list').then((m) => m.GovernorateList),
  },
  {
    path: ':governorateId/areas',
    loadComponent: () => import('./pages/area-list/area-list').then((m) => m.AreaList),
  },
];
