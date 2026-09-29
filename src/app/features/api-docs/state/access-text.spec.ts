import { buildEndpoint, buildFeature } from '../testing/api-docs-fixture';
import { accessText, featureAccessLabel } from './access-text';

describe('accessText', () => {
  it('names the permission an admin role must hold', () => {
    expect(accessText(buildFeature(), buildEndpoint())).toBe('places:view');
  });

  it('says any signed-in admin when no permission is checked', () => {
    expect(accessText(buildFeature(), buildEndpoint({ permission: null }))).toBe(
      'Any signed-in admin',
    );
  });

  it('asks for a place owner token on an owner app call', () => {
    const feature = buildFeature({ app: 'owner', permissionModule: null });

    expect(accessText(feature, buildEndpoint())).toBe('Place owner token — own place only');
  });

  it('says public when no token is needed', () => {
    expect(accessText(buildFeature(), buildEndpoint({ isPublic: true }))).toBe('None — public');
  });
});

describe('featureAccessLabel', () => {
  it('shows the permission module of an admin feature', () => {
    expect(featureAccessLabel(buildFeature())).toBe('places');
  });

  it('says no module when any signed-in admin may call it', () => {
    expect(featureAccessLabel(buildFeature({ permissionModule: null }))).toBe('no module');
  });

  it('says owner token for a place owner app feature', () => {
    expect(featureAccessLabel(buildFeature({ app: 'owner', permissionModule: null }))).toBe(
      'owner token',
    );
  });
});
