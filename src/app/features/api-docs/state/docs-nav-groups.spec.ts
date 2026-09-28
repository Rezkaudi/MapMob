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
    ],
    [{ id: 'db-locations', name: 'Locations' }],
  );

  it('lists the four groups in reading order', () => {
    expect(groups.map((group) => group.title)).toEqual([
      'Start here',
      'Endpoints',
      'Database',
      'Wrap up',
    ]);
  });

  it('counts the endpoints of each feature', () => {
    expect(groups[1].links).toEqual([{ id: 'places', label: 'Places', count: 2 }]);
  });

  it('links the database domains and the export', () => {
    expect(groups[2].links.slice(0, 2).map((link) => link.id)).toEqual([
      'db-whole',
      'db-locations',
    ]);
    expect(groups[3].links.map((link) => link.id)).toContain('export');
  });
});
