import { toSubscriptionFilterParams } from './subscription-query-params';

const PAGE = { pageIndex: 1, pageSize: 10 };

describe('toSubscriptionFilterParams', () => {
  it('sends every picked filter with the server names', () => {
    const params = toSubscriptionFilterParams({
      ...PAGE,
      search: 'حلب',
      sort: 'newest',
      status: 'active',
      tier: 'featured',
      subscribedFrom: '2026-11-01',
      subscribedTo: '2026-11-08',
    });

    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['search', 'حلب'],
      ['sort_by', 'latest'],
      ['status', 'active'],
      ['plan_tier', 'featured'],
      ['date_from', '2026-11-01'],
      ['date_to', '2026-11-08'],
    ]);
  });

  it('asks for "cancelled", the server word for a paused subscription', () => {
    expect(toSubscriptionFilterParams({ ...PAGE, status: 'paused' }).get('status')).toBe(
      'cancelled',
    );
  });

  it('sends nothing when no filter is picked', () => {
    expect(toSubscriptionFilterParams(PAGE).keys()).toEqual([]);
  });
});
