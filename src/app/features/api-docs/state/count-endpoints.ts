import { ApiFeature } from '../models/api-feature';
import { HTTP_METHODS, HttpMethod } from '../models/http-method';
import { EndpointCounts } from './endpoint-counts';

export function countEndpoints(features: readonly ApiFeature[]): EndpointCounts {
  const byMethod = Object.fromEntries(HTTP_METHODS.map((method) => [method, 0])) as Record<
    HttpMethod,
    number
  >;
  const endpoints = features.flatMap((feature) => feature.endpoints);
  for (const endpoint of endpoints) {
    byMethod[endpoint.method] += 1;
  }
  return { total: endpoints.length, byMethod };
}
