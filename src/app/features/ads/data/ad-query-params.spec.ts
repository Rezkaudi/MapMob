import { toAdFilterParams, toAdQueryParams } from './ad-query-params';

function entriesOf(params: ReturnType<typeof toAdQueryParams>): string[][] {
  return params.keys().map((key) => [key, params.get(key) ?? '']);
}

describe('toAdQueryParams', () => {
  it('sends the server page, the search, the sort and the filters it knows', () => {
    const params = toAdQueryParams({
      pageIndex: 1,
      pageSize: 4,
      search: 'حملة',
      sort: 'oldest',
      status: 'paused',
      placement: 'searchResults',
    });

    expect(entriesOf(params)).toEqual([
      ['search', 'حملة'],
      ['sort_by', 'oldest'],
      ['status', 'inactive'],
      ['placement', 'search'],
      ['page', '2'],
      ['per_page', '4'],
    ]);
  });

  it('asks for active ads when the panel wants running or coming ones', () => {
    expect(toAdQueryParams({ pageIndex: 0, pageSize: 4, status: 'scheduled' }).get('status')).toBe(
      'active',
    );
    expect(toAdQueryParams({ pageIndex: 0, pageSize: 4, status: 'expired' }).get('status')).toBe(
      'expired',
    );
  });
});

describe('toAdFilterParams', () => {
  it('sends the filters without a page, for the export', () => {
    const params = toAdFilterParams({ pageIndex: 3, pageSize: 4, placement: 'placeDetails' });

    expect(entriesOf(params)).toEqual([['placement', 'store']]);
  });
});
