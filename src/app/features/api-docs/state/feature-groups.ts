import { ApiApp } from '../models/api-app';
import { ApiFeature } from '../models/api-feature';

export interface FeatureGroup {
  readonly app: ApiApp;
  readonly title: string;
  readonly features: readonly ApiFeature[];
}

export const APP_TITLES: Readonly<Record<ApiApp, string>> = {
  admin: 'Admin dashboard',
  owner: 'Place owner app',
};

const APP_ORDER: readonly ApiApp[] = ['admin', 'owner'];

export function groupFeaturesByApp(features: readonly ApiFeature[]): FeatureGroup[] {
  return APP_ORDER.map((app) => ({
    app,
    title: APP_TITLES[app],
    features: features.filter((feature) => feature.app === app),
  })).filter((group) => group.features.length > 0);
}
