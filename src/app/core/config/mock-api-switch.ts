import { environment } from '../../../environments/environment';
import { ApiFeatureName } from './api-feature-name';
import { LIVE_API_FEATURES } from './live-api-features';

export interface MockApiSettings {
  readonly isMockFlagOn: boolean;
  readonly liveFeatures: readonly ApiFeatureName[];
}

const APP_SETTINGS: MockApiSettings = {
  isMockFlagOn: environment.useMockApi,
  liveFeatures: LIVE_API_FEATURES,
};

/** A feature leaves its mock only when the flag is off and the live server can serve it. */
export function isMockApiUsed(
  feature: ApiFeatureName,
  settings: MockApiSettings = APP_SETTINGS,
): boolean {
  return settings.isMockFlagOn || !settings.liveFeatures.includes(feature);
}
