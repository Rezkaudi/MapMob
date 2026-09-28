import { buildEndpoint, buildFeature } from '../testing/api-docs-fixture';
import { filterApiFeatures } from './filter-api-features';

const list = buildEndpoint({ id: 'places-list', path: '/places' });
const detail = buildEndpoint({
  id: 'places-detail',
  path: '/places/{id}',
  summary: 'The full place detail page.',
});
const remove = buildEndpoint({ id: 'places-delete', method: 'DELETE', path: '/places/{id}' });
const places = buildFeature({ id: 'places', endpoints: [list, detail, remove] });
const users = buildFeature({
  id: 'users',
  name: 'Users',
  endpoints: [buildEndpoint({ id: 'users-list', path: '/users' })],
});

describe('filterApiFeatures', () => {
  it('keeps everything with no search and no method', () => {
    expect(filterApiFeatures([places, users], '', null)).toEqual([places, users]);
  });

  it('keeps endpoints whose path matches, in any case', () => {
    expect(filterApiFeatures([places, users], 'USERS', null).map((feature) => feature.id)).toEqual([
      'users',
    ]);
  });

  it('matches the summary and the method too', () => {
    expect(filterApiFeatures([places, users], 'detail page', null)[0].endpoints).toEqual([detail]);
    expect(filterApiFeatures([places, users], 'delete', null)[0].endpoints).toEqual([remove]);
  });

  it('keeps only endpoints with the picked method', () => {
    expect(filterApiFeatures([places, users], '', 'DELETE')).toEqual([
      { ...places, endpoints: [remove] },
    ]);
  });

  it('drops features left with no endpoints', () => {
    expect(filterApiFeatures([places, users], 'nothing-matches', null)).toEqual([]);
  });

  it('ignores spaces around the search', () => {
    expect(filterApiFeatures([places, users], '  /users  ', null)).toHaveLength(1);
  });
});
