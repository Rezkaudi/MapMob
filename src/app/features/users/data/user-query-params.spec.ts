import { toUserQueryParams } from './user-query-params';

describe('toUserQueryParams', () => {
  it('sends the page and only the filters that are set', () => {
    const params = toUserQueryParams({
      pageIndex: 2,
      pageSize: 6,
      search: 'أحمد',
      sort: 'newest',
      accountType: 'visitor',
      status: 'suspended',
      registeredFrom: '2026-08-01',
      registeredTo: '2026-09-02',
    });

    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['pageIndex', '2'],
      ['pageSize', '6'],
      ['search', 'أحمد'],
      ['sort', 'newest'],
      ['accountType', 'visitor'],
      ['status', 'suspended'],
      ['registeredFrom', '2026-08-01'],
      ['registeredTo', '2026-09-02'],
    ]);
  });

  it('leaves out filters that are not set', () => {
    expect(toUserQueryParams({ pageIndex: 0, pageSize: 6 }).keys()).toEqual([
      'pageIndex',
      'pageSize',
    ]);
  });
});
