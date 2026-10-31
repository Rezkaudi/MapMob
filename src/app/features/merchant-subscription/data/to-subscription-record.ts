import { NO_PLAN } from '../../../shared/data/owner-plan-of';
import { toIsoDay } from '../../../shared/formatting/iso-day';
import { BillingCycle } from '../../../shared/models/billing-cycle';
import { SubscriptionStatus } from '../../../shared/models/subscription-status';
import { CurrencyCode } from '../../../shared/money/currency-code';
import { SubscriptionRecord } from '../models/subscription-record';
import { LiveOwnerSubscription } from './live-owner-subscription';

const CASH = 'cash';
const YEARLY: BillingCycle = 'yearly';
const KNOWN_STATUSES: readonly SubscriptionStatus[] = ['active', 'paused', 'expired'];

export function toBillingCycle(cycle: string): BillingCycle {
  return cycle === YEARLY ? 'yearly' : 'monthly';
}

export function toCurrencyCode(code: string | null): CurrencyCode {
  return (code ?? 'SYP').toUpperCase() as CurrencyCode;
}

export function toSubscriptionRecord(subscription: LiveOwnerSubscription): SubscriptionRecord {
  return {
    id: String(subscription.id),
    plan: { id: String(subscription.plan.id), name: subscription.plan.name },
    term: toBillingCycle(subscription.plan.billingCycle),
    price: {
      amount: subscription.amountPaid ?? subscription.plan.price,
      currency: toCurrencyCode(subscription.currencyCode ?? subscription.plan.currencyCode),
    },
    paymentMethod:
      !subscription.paymentMethod || subscription.paymentMethod === CASH ? 'cash' : 'other',
    startsOn: toIsoDay(subscription.startsAt),
    endsOn: toIsoDay(subscription.endsAt),
    status: KNOWN_STATUSES.find((known) => known === subscription.status) ?? 'expired',
  };
}

/** The page always shows a current plan; a place with none gets this ended stand-in. */
export function noPlanRecord(today: string): SubscriptionRecord {
  return {
    id: '',
    plan: NO_PLAN,
    term: 'monthly',
    price: { amount: 0, currency: 'SYP' },
    paymentMethod: 'cash',
    startsOn: today,
    endsOn: today,
    status: 'expired',
  };
}
