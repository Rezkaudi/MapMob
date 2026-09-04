import { Routes } from '@angular/router';

export const PLACES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/place-list/place-list').then((m) => m.PlaceList),
  },
];
