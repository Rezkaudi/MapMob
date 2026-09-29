import { HttpParams } from '@angular/common/http';
import { ListQuery } from '../models/list-query';

/** The lists that only page, search and sort send the same params. */
export function toListQueryParams(query: ListQuery): HttpParams {
  let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
  if (query.search) {
    params = params.set('search', query.search);
  }
  if (query.sort) {
    params = params.set('sort', query.sort);
  }
  return params;
}
