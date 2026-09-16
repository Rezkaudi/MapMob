import { toOfferQueryParams } from './offer-query-params';

describe('toOfferQueryParams', () => {
  it('sends the page and only the filters that are set', () => {
    const params = toOfferQueryParams({
      pageIndex: 2,
      pageSize: 4,
      search: 'خصم',
      sort: 'newest',
      status: 'scheduled',
      runningFrom: '2026-08-01',
      runningTo: '2026-09-02',
    });

    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['pageIndex', '2'],
      ['pageSize', '4'],
      ['search', 'خصم'],
      ['sort', 'newest'],
      ['status', 'scheduled'],
      ['runningFrom', '2026-08-01'],
      ['runningTo', '2026-09-02'],
    ]);
  });

  it('leaves out filters that are not set', () => {
    expect(toOfferQueryParams({ pageIndex: 0, pageSize: 4 }).keys()).toEqual([
      'pageIndex',
      'pageSize',
    ]);
  });
});
