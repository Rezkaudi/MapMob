import { HttpParams } from '@angular/common/http';
import { ComplaintQuery } from '../models/complaint-query';

const OPTIONAL_KEYS = ['search', 'sort', 'status', 'reportedFrom', 'reportedTo'] as const;

export function toComplaintQueryParams(query: ComplaintQuery): HttpParams {
  let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
  for (const key of OPTIONAL_KEYS) {
    const value = query[key];
    if (value) {
      params = params.set(key, value);
    }
  }
  return params;
}
