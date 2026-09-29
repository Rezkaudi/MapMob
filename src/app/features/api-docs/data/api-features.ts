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
import { OWNER_ACCOUNT_FEATURE } from './endpoints/owner-account-endpoints';
import { OWNER_AUTH_FEATURE } from './endpoints/owner-auth-endpoints';
import { OWNER_MEDIA_FEATURE } from './endpoints/owner-media-endpoints';
import { OWNER_NOTIFICATIONS_FEATURE } from './endpoints/owner-notification-endpoints';
import { OWNER_OFFERS_FEATURE } from './endpoints/owner-offer-endpoints';
import { OWNER_OVERVIEW_FEATURE } from './endpoints/owner-overview-endpoints';
import { OWNER_PLACE_FEATURE } from './endpoints/owner-place-endpoints';
import { OWNER_PRODUCTS_FEATURE } from './endpoints/owner-product-endpoints';
import { PAYMENTS_FEATURE } from './endpoints/payment-endpoints';
import { PLACES_FEATURE } from './endpoints/place-endpoints';
import { REGIONS_FEATURE } from './endpoints/region-endpoints';
import { REPORTS_FEATURE } from './endpoints/report-endpoints';
import { REVIEWS_FEATURE } from './endpoints/review-endpoints';
import { SETTINGS_FEATURE } from './endpoints/settings-endpoints';
import { SUBSCRIPTIONS_FEATURE } from './endpoints/subscription-endpoints';
import { USERS_FEATURE } from './endpoints/user-endpoints';

/** In the order of the dashboard's sidebar, then the place owner area. */
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
  OWNER_AUTH_FEATURE,
  OWNER_OVERVIEW_FEATURE,
  OWNER_PLACE_FEATURE,
  OWNER_PRODUCTS_FEATURE,
  OWNER_OFFERS_FEATURE,
  OWNER_MEDIA_FEATURE,
  OWNER_NOTIFICATIONS_FEATURE,
  OWNER_ACCOUNT_FEATURE,
];
