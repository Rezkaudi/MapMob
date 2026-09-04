import { Routes } from '@angular/router';

export const REVIEWS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/review-list/review-list').then((m) => m.ReviewList),
  },
];
