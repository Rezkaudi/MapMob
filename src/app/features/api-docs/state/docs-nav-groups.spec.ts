import { buildEndpoint, buildFeature } from '../testing/api-docs-fixture';
import { docsNavGroups } from './docs-nav-groups';

describe('docsNavGroups', () => {
  const groups = docsNavGroups(
    [
      buildFeature({
        id: 'places',
        name: 'Places',
        endpoints: [buildEndpoint(), buildEndpoint({ id: 'b' })],
      }),
      buildFeature({ id: 'owner-place', name: 'Own place', app: 'owner' }),
    ],
    [{ id: 'db-locations', name: 'Locations' }],
  );

  it('lists the groups in reading order, one per app', () => {
    expect(groups.map((group) => group.title)).toEqual([
      'Start here',
      'Admin dashboard',
      'Place owner app',
      'Database',
      'Wrap up',
    ]);
  });

  it('counts the endpoints of each feature', () => {
    expect(groups[1].links).toEqual([{ id: 'places', label: 'Places', count: 2 }]);
    expect(groups[2].links).toEqual([{ id: 'owner-place', label: 'Own place', count: 1 }]);
  });

  it('links the database domains and the export', () => {
    expect(groups[3].links.slice(0, 2).map((link) => link.id)).toEqual([
      'db-whole',
      'db-locations',
    ]);
    expect(groups[4].links.map((link) => link.id)).toContain('export');
  });
});
