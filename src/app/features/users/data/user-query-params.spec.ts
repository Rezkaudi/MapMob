import { toUserFilterParams, toUserQueryParams } from './user-query-params';

describe('toUserQueryParams', () => {
  it('sends the page from 1, the page size and the filters the server knows', () => {
    const params = toUserQueryParams({
      pageIndex: 2,
      pageSize: 6,
      search: 'أحمد',
      sort: 'newest',
      status: 'suspended',
      registeredFrom: '2026-08-01',
      registeredTo: '2026-09-02',
    });

    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['role', 'customer'],
      ['search', 'أحمد'],
      ['status', 'suspended'],
      ['page', '3'],
      ['per_page', '6'],
    ]);
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
    const params = toUserFilterParams({ pageIndex: 4, pageSize: 6, status: 'active' });

    expect(params.keys()).toEqual(['role', 'status']);
  });
});
