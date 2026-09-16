import { toPaymentQueryParams } from './payment-query-params';

describe('toPaymentQueryParams', () => {
  it('sends the page and only the filters that are set', () => {
    const params = toPaymentQueryParams({
      pageIndex: 2,
      pageSize: 4,
      search: 'الحياة',
      sort: 'newest',
      paymentMethod: 'cash',
      currency: 'USD',
      paidOn: { from: '2026-08-01', to: '2026-09-02' },
    });

    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['pageIndex', '2'],
      ['pageSize', '4'],
      ['search', 'الحياة'],
      ['sort', 'newest'],
      ['paymentMethod', 'cash'],
      ['currency', 'USD'],
      ['paidFrom', '2026-08-01'],
      ['paidTo', '2026-09-02'],
    ]);
  });

  it('leaves out filters that are not set', () => {
    expect(toPaymentQueryParams({ pageIndex: 0, pageSize: 4 }).keys()).toEqual([
      'pageIndex',
      'pageSize',
    ]);
  });
});
