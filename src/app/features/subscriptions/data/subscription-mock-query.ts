import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { PagedResult } from '../../../core/models/paged-result';
import { Subscription } from '../models/subscription';
import { SubscriptionQuery } from '../models/subscription-query';

function matchesSearch(entry: Subscription, search: string | undefined): boolean {
  const term = search?.trim();
  return !term || entry.companyName.includes(term) || entry.planName.includes(term);
}

function startedWithin(entry: Subscription, query: SubscriptionQuery): boolean {
  if (query.subscribedFrom && entry.startedOn < query.subscribedFrom) {
    return false;
  }
  return !query.subscribedTo || entry.startedOn <= query.subscribedTo;
}

function matches(entry: Subscription, query: SubscriptionQuery): boolean {
  if (query.tier && entry.planTier !== query.tier) {
    return false;
  }
  if (query.status && entry.status !== query.status) {
    return false;
  }
  return matchesSearch(entry, query.search) && startedWithin(entry, query);
}

export function filterSubscriptions(
  entries: readonly Subscription[],
  query: SubscriptionQuery,
): readonly Subscription[] {
  return sortListEntries(
    entries.filter((entry) => matches(entry, query)),
    query.sort,
    (entry) => entry.startedOn,
    (entry) => entry.companyName,
  );
}

export function querySubscriptions(
  entries: readonly Subscription[],
  query: SubscriptionQuery,
): PagedResult<Subscription> {
  return paginate(filterSubscriptions(entries, query), query.pageIndex, query.pageSize);
}
