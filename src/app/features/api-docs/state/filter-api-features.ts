import { ApiEndpoint } from '../models/api-endpoint';
import { ApiFeature } from '../models/api-feature';
import { HttpMethod } from '../models/http-method';

function matchesSearch(endpoint: ApiEndpoint, needle: string): boolean {
  if (!needle) {
    return true;
  }
  return [endpoint.method, endpoint.path, endpoint.summary].some((text) =>
    text.toLowerCase().includes(needle),
  );
}

/** Keeps the endpoints that match both filters, and the features that still hold one. */
export function filterApiFeatures(
  features: readonly ApiFeature[],
  search: string,
  method: HttpMethod | null,
): ApiFeature[] {
  const needle = search.trim().toLowerCase();
  if (!needle && !method) {
    return [...features];
  }
  return features
    .map((feature) => ({
      ...feature,
      endpoints: feature.endpoints.filter(
        (endpoint) => matchesSearch(endpoint, needle) && (!method || endpoint.method === method),
      ),
    }))
    .filter((feature) => feature.endpoints.length > 0);
}
