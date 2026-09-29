import { ApiEndpoint } from '../models/api-endpoint';
import { ApiFeature } from '../models/api-feature';
import { requiredPermission } from './required-permission';

const PUBLIC_ACCESS = 'None — public';
const OWNER_ACCESS = 'Place owner token — own place only';
const ANY_ADMIN_ACCESS = 'Any signed-in admin';
const OWNER_TOKEN_LABEL = 'owner token';
const NO_MODULE_LABEL = 'no module';

/** Who may call the endpoint, in words for the page and the README. */
export function accessText(feature: ApiFeature, endpoint: ApiEndpoint): string {
  if (endpoint.isPublic) {
    return PUBLIC_ACCESS;
  }
  if (feature.app === 'owner') {
    return OWNER_ACCESS;
  }
  return requiredPermission(feature, endpoint) ?? ANY_ADMIN_ACCESS;
}

/** The short chip beside a feature: its permission module, or the kind of token it needs. */
export function featureAccessLabel(feature: ApiFeature): string {
  if (feature.app === 'owner') {
    return OWNER_TOKEN_LABEL;
  }
  return feature.permissionModule ?? NO_MODULE_LABEL;
}
