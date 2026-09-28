import { Routes } from '@angular/router';
import { MERCHANT_AUTH_PAGE_ROUTES } from './features/merchant-auth/merchant-auth.routes';
import { merchantSignedInGuard } from './features/merchant-auth/guards/merchant-signed-in.guard';
import { MERCHANT_HOME_ROUTE } from './layout/merchant-shell/merchant-nav-items';

const loadMerchantOfferForm = () =>
  import('./features/merchant-offers/pages/merchant-offer-form-page/merchant-offer-form-page').then(
    (m) => m.MerchantOfferFormPage,
  );

/** Everything under /merchant: the sign-in screens, then the store owner's dashboard. */
export const MERCHANT_ROUTES: Routes = [
  ...MERCHANT_AUTH_PAGE_ROUTES,
  {
    path: '',
    loadComponent: () =>
      import('./layout/merchant-shell/merchant-shell').then((m) => m.MerchantShell),
    canActivate: [merchantSignedInGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/merchant-overview/pages/merchant-home/merchant-home').then(
            (m) => m.MerchantHome,
          ),
      },
      {
        path: 'store',
        loadComponent: () =>
          import('./features/merchant-store/pages/store-profile-page/store-profile-page').then(
            (m) => m.StoreProfilePage,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/merchant-products/pages/merchant-products-page/merchant-products-page').then(
            (m) => m.MerchantProductsPage,
          ),
      },
      {
        path: 'offers',
        loadComponent: () =>
          import('./features/merchant-offers/pages/merchant-offers-page/merchant-offers-page').then(
            (m) => m.MerchantOffersPage,
          ),
      },
      { path: 'offers/new', loadComponent: loadMerchantOfferForm },
      { path: 'offers/:id/edit', loadComponent: loadMerchantOfferForm },
      {
        path: 'not-found',
        data: { homeRoute: MERCHANT_HOME_ROUTE },
        loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
      },
      // Sidebar links whose merchant pages are not built yet land here, not on a blank page.
      { path: '**', redirectTo: 'not-found' },
    ],
  },
];
