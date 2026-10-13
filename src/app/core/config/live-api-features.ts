import { ApiFeatureName } from './api-feature-name';

/** Features whose calls the live server answers correctly today. */
export const LIVE_API_FEATURES: readonly ApiFeatureName[] = [
  'auth',
  'dashboard',
  'regions',
  'places',
];
