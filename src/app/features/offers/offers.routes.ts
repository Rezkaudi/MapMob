import { Routes } from '@angular/router';

const loadOfferForm = () => import('./pages/offer-form/offer-form').then((m) => m.OfferForm);

export const OFFERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/offer-list/offer-list').then((m) => m.OfferList),
  },
  { path: 'new', loadComponent: loadOfferForm },
  { path: ':id/edit', loadComponent: loadOfferForm },
];
