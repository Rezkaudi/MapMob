import { HttpParams } from '@angular/common/http';
import { SubscriptionQuery } from '../models/subscription-query';

const OPTIONAL_FILTER_KEYS = [
  'search',
  'sort',
  'tier',
  'status',
  'subscribedFrom',
  'subscribedTo',
] as const;

export function toSubscriptionQueryParams(query: SubscriptionQuery): HttpParams {
  let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
  for (const key of OPTIONAL_FILTER_KEYS) {
    const value = query[key];
    if (value) {
      params = params.set(key, value);
    }
  }
  return params;
}
