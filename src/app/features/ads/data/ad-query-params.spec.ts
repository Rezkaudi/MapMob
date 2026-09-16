import { toAdQueryParams } from './ad-query-params';

describe('toAdQueryParams', () => {
  it('sends the page and only the filters that are set', () => {
    const params = toAdQueryParams({
      pageIndex: 1,
      pageSize: 4,
      search: 'حملة',
      status: 'active',
      contentType: 'video',
      advertiserType: 'admin',
      placement: 'home',
      runningFrom: '2026-08-01',
    });

    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['pageIndex', '1'],
      ['pageSize', '4'],
      ['search', 'حملة'],
      ['status', 'active'],
      ['contentType', 'video'],
      ['advertiserType', 'admin'],
      ['placement', 'home'],
      ['runningFrom', '2026-08-01'],
    ]);
  });
});
