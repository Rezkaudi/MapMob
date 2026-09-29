import { buildFeature } from '../testing/api-docs-fixture';
import { groupFeaturesByApp } from './feature-groups';

describe('groupFeaturesByApp', () => {
  const places = buildFeature({ id: 'places', app: 'admin' });
  const ownerPlace = buildFeature({ id: 'owner-place', app: 'owner' });
  const users = buildFeature({ id: 'users', app: 'admin' });

  it('puts the admin dashboard first and the place owner app second, keeping feature order', () => {
    const groups = groupFeaturesByApp([places, ownerPlace, users]);

    expect(groups.map((group) => group.title)).toEqual(['Admin dashboard', 'Place owner app']);
    expect(groups[0].features).toEqual([places, users]);
    expect(groups[1].features).toEqual([ownerPlace]);
  });

  it('drops an app that has no feature left', () => {
    expect(groupFeaturesByApp([ownerPlace]).map((group) => group.app)).toEqual(['owner']);
  });
});
