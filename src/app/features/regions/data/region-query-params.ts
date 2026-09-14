import { HttpParams } from '@angular/common/http';
import { GovernorateQuery } from '../models/governorate-query';

/** Both region lists page, search and sort the same way. */
export function toRegionQueryParams(query: GovernorateQuery): HttpParams {
  let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
  if (query.search) {
    params = params.set('search', query.search);
  }
  if (query.sort) {
    params = params.set('sort', query.sort);
  }
  return params;
}
