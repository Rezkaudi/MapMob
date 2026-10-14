import { toIsoDay } from '../../../shared/formatting/iso-day';
import { SubscriptionStatus } from '../../../shared/models/subscription-status';
import { CURRENCY_SYMBOLS } from '../../../shared/money/currency-symbols';
import { toCurrencyCode } from '../../../shared/money/to-currency-code';
import { Subscription } from '../models/subscription';
import { LivePlan } from '../../../shared/data/live-plan';
import { toPlanTier } from '../../../shared/data/live-plan-tier';
import { LiveSubscription } from './live-subscription';

export function toSubscriptionStatus(liveStatus: string): SubscriptionStatus {
  if (liveStatus === 'active' || liveStatus === 'expired') {
    return liveStatus;
  }
  return 'paused';
}

export function toSubscription(row: LiveSubscription, allPlans: readonly LivePlan[]): Subscription {
  return {
    id: String(row.id),
    companyName: row.store.name,
    planName: row.plan.name,
    planTier: toPlanTier(row.plan, allPlans),
    price: row.plan.price,
    currencySymbol: CURRENCY_SYMBOLS[toCurrencyCode(row.plan.currency_code)],
    startedOn: toIsoDay(row.starts_at),
    endsOn: toIsoDay(row.ends_at),
    status: toSubscriptionStatus(row.status),
  };
}
