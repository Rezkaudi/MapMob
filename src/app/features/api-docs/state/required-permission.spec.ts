import { buildEndpoint, buildFeature } from '../testing/api-docs-fixture';
import { requiredPermission } from './required-permission';

const feature = buildFeature({ permissionModule: 'places' });

describe('requiredPermission', () => {
  it.each([
    ['GET', 'places:view'],
    ['POST', 'places:add'],
    ['PUT', 'places:edit'],
    ['PATCH', 'places:edit'],
    ['DELETE', 'places:delete'],
  ] as const)('maps %s to %s', (method, permission) => {
    expect(requiredPermission(feature, buildEndpoint({ method }))).toBe(permission);
  });

  it('lets an endpoint name its own permission', () => {
    const endpoint = buildEndpoint({ method: 'POST', permission: 'places:delete' });

    expect(requiredPermission(feature, endpoint)).toBe('places:delete');
  });

  it('needs no permission when the endpoint says null', () => {
    expect(requiredPermission(feature, buildEndpoint({ permission: null }))).toBeNull();
  });

  it('needs no permission in a feature without a module', () => {
    const open = buildFeature({ permissionModule: null });

    expect(requiredPermission(open, buildEndpoint())).toBeNull();
  });

  it('needs no permission on a public endpoint', () => {
    expect(requiredPermission(feature, buildEndpoint({ isPublic: true }))).toBeNull();
  });
});
