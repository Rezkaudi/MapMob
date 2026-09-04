import { Routes } from '@angular/router';
import { AdminShell } from './layout/admin-shell/admin-shell';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: AdminShell,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'places',
        loadChildren: () => import('./features/places/places.routes').then((m) => m.PLACES_ROUTES),
      },
      {
        path: 'regions',
        loadChildren: () =>
          import('./features/regions/regions.routes').then((m) => m.REGIONS_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
      },
      {
        path: 'reviews',
        loadChildren: () =>
          import('./features/reviews/reviews.routes').then((m) => m.REVIEWS_ROUTES),
      },
    ],
  },
];
