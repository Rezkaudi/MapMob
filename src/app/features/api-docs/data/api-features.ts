import { ApiFeature } from '../models/api-feature';
import { ADS_FEATURE } from './endpoints/ad-endpoints';
import { AUTH_FEATURE } from './endpoints/auth-endpoints';
import { CATEGORIES_FEATURE } from './endpoints/category-endpoints';
import { COMPLAINTS_FEATURE } from './endpoints/complaint-endpoints';
import { CONTENT_FEATURE } from './endpoints/content-endpoints';
import { DASHBOARD_FEATURE } from './endpoints/dashboard-endpoints';
import { INBOX_FEATURE } from './endpoints/inbox-endpoints';
import { NOTIFICATIONS_FEATURE } from './endpoints/notification-endpoints';
import { OFFERS_FEATURE } from './endpoints/offer-endpoints';
import { PAYMENTS_FEATURE } from './endpoints/payment-endpoints';
import { PLACES_FEATURE } from './endpoints/place-endpoints';
import { REGIONS_FEATURE } from './endpoints/region-endpoints';
import { REPORTS_FEATURE } from './endpoints/report-endpoints';
import { REVIEWS_FEATURE } from './endpoints/review-endpoints';
import { SETTINGS_FEATURE } from './endpoints/settings-endpoints';
import { SUBSCRIPTIONS_FEATURE } from './endpoints/subscription-endpoints';
import { USERS_FEATURE } from './endpoints/user-endpoints';

/** In the order of the dashboard's sidebar. */
export const API_FEATURES: readonly ApiFeature[] = [
  AUTH_FEATURE,
  DASHBOARD_FEATURE,
  PLACES_FEATURE,
  CATEGORIES_FEATURE,
  REGIONS_FEATURE,
  USERS_FEATURE,
  REVIEWS_FEATURE,
  OFFERS_FEATURE,
  ADS_FEATURE,
  SUBSCRIPTIONS_FEATURE,
  PAYMENTS_FEATURE,
  REPORTS_FEATURE,
  CONTENT_FEATURE,
  NOTIFICATIONS_FEATURE,
  COMPLAINTS_FEATURE,
  INBOX_FEATURE,
  SETTINGS_FEATURE,
];
