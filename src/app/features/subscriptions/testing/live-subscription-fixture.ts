import { LIVE_GOLD_PLAN } from '../../../shared/testing/live-plan-fixture';
import { LiveSubscription } from '../data/live-subscription';

export const LIVE_SUBSCRIPTION: LiveSubscription = {
  id: 7,
  store: { id: 1, name: 'متجر دمشق' },
  plan: LIVE_GOLD_PLAN,
  starts_at: '2026-10-04T00:00:00+00:00',
  ends_at: '2026-11-03T23:59:59+00:00',
  status: 'active',
  auto_renew: true,
  created_at: '2026-10-04T20:22:42+00:00',
};
