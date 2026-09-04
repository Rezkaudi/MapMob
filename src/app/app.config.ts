import { LOCALE_ID, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import localeAr from '@angular/common/locales/ar';

import { routes } from './app.routes';
import { provideApiBaseUrl } from './core/config/api-base-url';
import { provideUseMockApi } from './core/config/use-mock-api';
import { provideReviewsFeature } from './features/reviews/reviews.providers';
import { provideDashboardFeature } from './features/dashboard/dashboard.providers';
import { provideUsersFeature } from './features/users/users.providers';
import { provideRegionsFeature } from './features/regions/regions.providers';
import { providePlacesFeature } from './features/places/places.providers';
import { provideAuthFeature } from './features/auth/auth.providers';

registerLocaleData(localeAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'ar' },
    provideApiBaseUrl(),
    provideUseMockApi(),
    provideReviewsFeature(),
    provideDashboardFeature(),
    provideUsersFeature(),
    provideRegionsFeature(),
    providePlacesFeature(),
    provideAuthFeature(),
  ],
};
