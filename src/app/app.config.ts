import { LOCALE_ID, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import localeAr from '@angular/common/locales/ar';

import { routes } from './app.routes';
import { provideApiBaseUrl } from './core/config/api-base-url';
import { provideUseMockApi } from './core/config/use-mock-api';
import { provideAdsFeature } from './features/ads/ads.providers';
import { provideAuthFeature } from './features/auth/auth.providers';
import { provideCategoriesFeature } from './features/categories/categories.providers';
import { provideDashboardFeature } from './features/dashboard/dashboard.providers';
import { provideOffersFeature } from './features/offers/offers.providers';
import { providePaymentsFeature } from './features/payments/payments.providers';
import { providePlacesFeature } from './features/places/places.providers';
import { provideRegionsFeature } from './features/regions/regions.providers';
import { provideReviewsFeature } from './features/reviews/reviews.providers';
import { provideSubscriptionsFeature } from './features/subscriptions/subscriptions.providers';
import { provideUsersFeature } from './features/users/users.providers';

registerLocaleData(localeAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'ar' },
    provideApiBaseUrl(),
    provideUseMockApi(),
    provideAdsFeature(),
    provideOffersFeature(),
    providePaymentsFeature(),
    provideReviewsFeature(),
    provideSubscriptionsFeature(),
    provideDashboardFeature(),
    provideUsersFeature(),
    provideRegionsFeature(),
    provideCategoriesFeature(),
    providePlacesFeature(),
    provideAuthFeature(),
  ],
};
