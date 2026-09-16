import { Routes } from '@angular/router';

export const SUBSCRIPTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/subscription-hub/subscription-hub').then((m) => m.SubscriptionHub),
  },
];
