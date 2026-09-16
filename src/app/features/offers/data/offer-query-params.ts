import { HttpParams } from '@angular/common/http';
import { OfferQuery } from '../models/offer-query';

const OPTIONAL_FILTER_KEYS = ['search', 'sort', 'status', 'runningFrom', 'runningTo'] as const;

export function toOfferQueryParams(query: OfferQuery): HttpParams {
  let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
  for (const key of OPTIONAL_FILTER_KEYS) {
    const value = query[key];
    if (value) {
      params = params.set(key, value);
    }
  }
  return params;
}
