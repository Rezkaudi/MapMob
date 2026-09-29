import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { signedInGuard } from './features/auth/guards/signed-in.guard';
import { AuthStore } from './features/auth/state/auth.store';
import { AdminShell } from './layout/admin-shell/admin-shell';

const ADMIN_HOME_ROUTE = '/admin/dashboard';
const MERCHANT_HOME_ROUTE = '/merchant/dashboard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    // Public, so the backend team can read it without a dashboard account.
    path: 'docs',
    loadChildren: () =>
      import('./features/api-docs/api-docs.routes').then((m) => m.API_DOCS_ROUTES),
  },
  {
    path: 'merchant',
    loadChildren: () => import('./merchant.routes').then((m) => m.MERCHANT_ROUTES),
  },
  {
    // The root opens the dashboard of whoever is signed in; the guards handle everyone else.
    path: '',
    pathMatch: 'full',
    redirectTo: () => (inject(AuthStore).isMerchant() ? MERCHANT_HOME_ROUTE : ADMIN_HOME_ROUTE),
  },
  {
    path: 'admin',
    component: AdminShell,
    canActivate: [signedInGuard],
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
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES),
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
      {
        path: 'offers',
        loadChildren: () => import('./features/offers/offers.routes').then((m) => m.OFFERS_ROUTES),
      },
      {
        path: 'ads',
        loadChildren: () => import('./features/ads/ads.routes').then((m) => m.ADS_ROUTES),
      },
      {
        path: 'subscriptions',
        loadChildren: () =>
          import('./features/subscriptions/subscriptions.routes').then(
            (m) => m.SUBSCRIPTIONS_ROUTES,
          ),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./features/payments/payments.routes').then((m) => m.PAYMENTS_ROUTES),
      },
      {
        path: 'delivery-platforms',
        loadChildren: () =>
          import('./features/delivery-platforms/delivery-platforms.routes').then(
            (m) => m.DELIVERY_PLATFORMS_ROUTES,
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./features/notifications/notifications.routes').then(
            (m) => m.NOTIFICATIONS_ROUTES,
          ),
      },
      {
        path: 'inbox',
        loadChildren: () => import('./features/inbox/inbox.routes').then((m) => m.INBOX_ROUTES),
      },
      {
        path: 'complaints',
        loadChildren: () =>
          import('./features/complaints/complaints.routes').then((m) => m.COMPLAINTS_ROUTES),
      },
      {
        path: 'content',
        loadChildren: () =>
          import('./features/content/content.routes').then((m) => m.CONTENT_ROUTES),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
      },
      {
        path: 'not-found',
        loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
      },
      // Nav links without a feature behind them land here instead of a blank page.
      { path: '**', redirectTo: 'not-found' },
    ],
  },
  {
    // Admin pages lived at the root before the /admin prefix, so old bookmarks move over.
    path: '**',
    redirectTo: ({ url }) => `/admin/${url.map((segment) => segment.path).join('/')}`,
  },
];
