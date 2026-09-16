import { HttpParams } from '@angular/common/http';
import { AdQuery } from '../models/ad-query';

const OPTIONAL_FILTER_KEYS = [
  'search',
  'sort',
  'status',
  'contentType',
  'advertiserType',
  'placement',
  'runningFrom',
  'runningTo',
] as const;

export function toAdQueryParams(query: AdQuery): HttpParams {
  let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
  for (const key of OPTIONAL_FILTER_KEYS) {
    const value = query[key];
    if (value) {
      params = params.set(key, value);
    }
  }
  return params;
}
