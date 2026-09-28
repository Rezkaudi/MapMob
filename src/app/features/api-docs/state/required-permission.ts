import { ApiEndpoint } from '../models/api-endpoint';
import { ApiFeature } from '../models/api-feature';
import { HttpMethod } from '../models/http-method';

const ACTION_BY_METHOD: Record<HttpMethod, string> = {
  GET: 'view',
  POST: 'add',
  PUT: 'edit',
  PATCH: 'edit',
  DELETE: 'delete',
};

/** The `module:action` grant the admin's role must hold, or `null` when none is needed. */
export function requiredPermission(feature: ApiFeature, endpoint: ApiEndpoint): string | null {
  if (endpoint.isPublic) {
    return null;
  }
  if (endpoint.permission !== undefined) {
    return endpoint.permission;
  }
  if (!feature.permissionModule) {
    return null;
  }
  return `${feature.permissionModule}:${ACTION_BY_METHOD[endpoint.method]}`;
}
