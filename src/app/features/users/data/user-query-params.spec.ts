import { toUserFilterParams, toUserQueryParams } from './user-query-params';

describe('toUserQueryParams', () => {
  it('sends the page from 1, the page size and the filters the server knows', () => {
    const params = toUserQueryParams({
      pageIndex: 2,
      pageSize: 6,
      search: 'أحمد',
      sort: 'oldest',
      status: 'suspended',
      registeredFrom: '2026-08-01',
      registeredTo: '2026-09-02',
    });

    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['role', 'customer'],
      ['search', 'أحمد'],
      ['status', 'suspended'],
      ['sort_by', 'oldest'],
      ['date_from', '2026-08-01'],
      ['date_to', '2026-09-02'],
      ['page', '3'],
      ['per_page', '6'],
    ]);
  });

  it('sorts by name, and sends "latest" for the newest, since the server refuses "newest"', () => {
    const sortOf = (sort: 'newest' | 'name') =>
      toUserQueryParams({ pageIndex: 0, pageSize: 6, sort }).get('sort_by');

    expect(sortOf('name')).toBe('name_asc');
    expect(sortOf('newest')).toBe('latest');
  });

  it('sends the account type the filter picked', () => {
    expect(
      toUserQueryParams({ pageIndex: 0, pageSize: 6, accountType: 'registered' }).get(
        'account_type',
      ),
    ).toBe('registered');
    expect(
      toUserQueryParams({ pageIndex: 0, pageSize: 6, accountType: 'visitor' }).get('account_type'),
    ).toBe('visitor');
  });

  it('leaves out filters that are not set', () => {
    expect(toUserQueryParams({ pageIndex: 0, pageSize: 6 }).keys()).toEqual([
      'role',
      'page',
      'per_page',
    ]);
  });
});

describe('toUserFilterParams', () => {
  it('keeps the filters and drops the page, for the export', () => {
    const params = toUserFilterParams({
      pageIndex: 4,
      pageSize: 6,
      status: 'active',
      registeredFrom: '2026-11-07',
    });

    expect(params.keys()).toEqual(['role', 'status', 'date_from']);
  });
});
