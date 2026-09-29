import { ApiEndpoint } from '../models/api-endpoint';
import { ApiFeature } from '../models/api-feature';

export function buildEndpoint(overrides: Partial<ApiEndpoint> = {}): ApiEndpoint {
  return {
    id: 'places-list',
    method: 'GET',
    path: '/places',
    summary: 'The paged places table.',
    response: { status: 200, description: 'One page of places.', example: { items: [] } },
    ...overrides,
  };
}

export function buildFeature(overrides: Partial<ApiFeature> = {}): ApiFeature {
  return {
    id: 'places',
    name: 'Places',
    app: 'admin',
    screen: '/admin/places',
    permissionModule: 'places',
    intro: 'The core entity.',
    endpoints: [buildEndpoint()],
    ...overrides,
  };
}
