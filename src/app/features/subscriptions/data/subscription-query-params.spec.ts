import { LivePlan } from '../../../shared/data/live-plan';
import { toSubscriptionFilterParams } from './subscription-query-params';

const PAGE = { pageIndex: 1, pageSize: 10 };
const PLANS = [
  { slug: 'saver-plan', price: 100 },
  { slug: 'golden-plan', price: 150000 },
] as LivePlan[];

describe('toSubscriptionFilterParams', () => {
  it('sends every picked filter with the server names', () => {
    const params = toSubscriptionFilterParams(
      {
        ...PAGE,
        search: 'حلب',
        sort: 'newest',
        status: 'active',
        tier: 'featured',
        subscribedFrom: '2026-11-01',
        subscribedTo: '2026-11-08',
      },
      PLANS,
    );

    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['search', 'حلب'],
      ['sort_by', 'latest'],
      ['status', 'active'],
      ['plan_tier', 'golden-plan'],
      ['date_from', '2026-11-01'],
      ['date_to', '2026-11-08'],
    ]);
  });

  it('asks for "cancelled", the server word for a paused subscription', () => {
    expect(toSubscriptionFilterParams({ ...PAGE, status: 'paused' }, PLANS).get('status')).toBe(
      'cancelled',
    );
  });

  it('sends the plan slug the server filters by, as the places list does', () => {
    expect(toSubscriptionFilterParams({ ...PAGE, tier: 'basic' }, PLANS).get('plan_tier')).toBe(
      'saver-plan',
    );
  });

  it('sends nothing when no filter is picked', () => {
    expect(toSubscriptionFilterParams(PAGE, PLANS).keys()).toEqual([]);
  });
});
