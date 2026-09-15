import { HttpParams } from '@angular/common/http';
import { ReviewQuery } from '../models/review-query';

const OPTIONAL_FILTER_KEYS = [
  'search',
  'sort',
  'rating',
  'status',
  'placeName',
  'submittedFrom',
  'submittedTo',
] as const;

export function toReviewQueryParams(query: ReviewQuery): HttpParams {
  let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
  for (const key of OPTIONAL_FILTER_KEYS) {
    const value = query[key];
    if (value) {
      params = params.set(key, value);
    }
  }
  return params;
}
