import { Routes } from '@angular/router';

export const DELIVERY_PLATFORMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/delivery-platform-list/delivery-platform-list').then(
        (m) => m.DeliveryPlatformList,
      ),
  },
];
