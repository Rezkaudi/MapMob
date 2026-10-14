import { LIVE_GOLD_PLAN } from '../testing/live-plan-fixture';
import { LivePlan } from './live-plan';
import { toPlanTier } from './live-plan-tier';

const LIVE_FREE_PLAN: LivePlan = { ...LIVE_GOLD_PLAN, id: 2, slug: 'free', price: 0 };
const LIVE_SILVER_PLAN: LivePlan = { ...LIVE_GOLD_PLAN, id: 3, slug: 'silver', price: 50000 };
const ALL_PLANS = [LIVE_GOLD_PLAN, LIVE_FREE_PLAN, LIVE_SILVER_PLAN];

describe('toPlanTier', () => {
  it('calls a plan with no price free, the dearest paid plan featured, and the rest basic', () => {
    expect(toPlanTier(LIVE_FREE_PLAN, ALL_PLANS)).toBe('free');
    expect(toPlanTier(LIVE_GOLD_PLAN, ALL_PLANS)).toBe('featured');
    expect(toPlanTier(LIVE_SILVER_PLAN, ALL_PLANS)).toBe('basic');
  });
});
