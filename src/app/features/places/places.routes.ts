import { Routes } from '@angular/router';

export const PLACES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/place-list/place-list').then((m) => m.PlaceList),
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/place-form/place-form').then((m) => m.PlaceForm),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/place-form/place-form').then((m) => m.PlaceForm),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/place-detail/place-detail').then((m) => m.PlaceDetail),
  },
];
