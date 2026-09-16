import { MOCK_PLACES } from '../../../../mock/mock-places';
import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { addCalendarDays, toCalendarDay } from '../../../shared/formatting/calendar-day';
import { PLAN_TIER_LABEL } from '../models/plan-tier-label';
import { PlanTier } from '../models/plan-tier';
import { Subscription } from '../models/subscription';
import { SubscriptionStatus } from '../models/subscription-status';

const SEED = 20260916;
const EARLIEST_START_DAYS = -540;
const LATEST_START_DAYS = -10;
const TERM_DAYS = 365;
const PAUSED_SHARE = 0.08;

/** The prices the design shows against each tier, in dollars. */
const TIER_PRICE: Record<PlanTier, number> = { free: 0, basic: 12, featured: 24 };
const TIERS: readonly PlanTier[] = ['free', 'basic', 'featured'];
const CURRENCY_SYMBOL = '$';

function pickStatus(next: () => number, endsOn: string, today: string): SubscriptionStatus {
  if (endsOn < today) {
    return 'expired';
  }
  return next() < PAUSED_SHARE ? 'paused' : 'active';
}

export function buildSubscriptionSeed(today: Date, count: number): readonly Subscription[] {
  const next = createSeededRandom(SEED);
  const todayDay = toCalendarDay(today);

  return Array.from({ length: count }, (_, index) => {
    const startedOn = addCalendarDays(
      todayDay,
      randomInt(next, EARLIEST_START_DAYS, LATEST_START_DAYS),
    );
    const endsOn = addCalendarDays(startedOn, TERM_DAYS);
    const planTier = pickOne(next, TIERS);
    return {
      id: `subscription-${index + 1}`,
      companyName: pickOne(next, MOCK_PLACES).name,
      planName: PLAN_TIER_LABEL[planTier],
      planTier,
      price: TIER_PRICE[planTier],
      currencySymbol: CURRENCY_SYMBOL,
      startedOn,
      endsOn,
      status: pickStatus(next, endsOn, todayDay),
    };
  });
}
