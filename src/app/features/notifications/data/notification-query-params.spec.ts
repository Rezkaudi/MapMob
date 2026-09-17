import { toNotificationQueryParams } from './notification-query-params';

describe('toNotificationQueryParams', () => {
  it('sends the page and only the filters that are set', () => {
    const params = toNotificationQueryParams({
      pageIndex: 1,
      pageSize: 4,
      search: 'عروض',
      sort: 'newest',
      audience: 'users',
      kind: 'general',
      status: 'sent',
      sentFrom: '2026-08-01',
      sentTo: '2026-09-02',
    });

    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['pageIndex', '1'],
      ['pageSize', '4'],
      ['search', 'عروض'],
      ['sort', 'newest'],
      ['audience', 'users'],
      ['kind', 'general'],
      ['status', 'sent'],
      ['sentFrom', '2026-08-01'],
      ['sentTo', '2026-09-02'],
    ]);
  });

  it('leaves out filters that are not set', () => {
    expect(toNotificationQueryParams({ pageIndex: 0, pageSize: 4 }).keys()).toEqual([
      'pageIndex',
      'pageSize',
    ]);
  });
});
