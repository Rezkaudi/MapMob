import { HttpParams } from '@angular/common/http';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { LivePlan } from '../../../shared/data/live-plan';
import { toLivePlanSlug } from '../../../shared/data/live-plan-slug';
import { SubscriptionStatus } from '../../../shared/models/subscription-status';
import { SubscriptionQuery } from '../models/subscription-query';

// A cancelled subscription is what the panel shows as paused.
const LIVE_STATUS: Record<SubscriptionStatus, string> = {
  active: 'active',
  paused: 'cancelled',
  expired: 'expired',
};

/** Every filter the subscriptions list sends. */
export function toSubscriptionFilterParams(
  query: SubscriptionQuery,
  plans: readonly LivePlan[],
): HttpParams {
  return toLiveFilterParams({
    search: query.search,
    sort_by: toLiveSort(query.sort),
    status: query.status ? LIVE_STATUS[query.status] : null,
    plan_tier: query.tier ? toLivePlanSlug(query.tier, plans) : null,
    date_from: query.subscribedFrom,
    date_to: query.subscribedTo,
  });
}
