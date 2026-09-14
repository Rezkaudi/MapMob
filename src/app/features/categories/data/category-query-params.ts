import { HttpParams } from '@angular/common/http';
import { CategoryQuery } from '../models/category-query';

const OPTIONAL_FILTER_KEYS = ['search', 'sort', 'kind', 'status', 'parentId'] as const;

export function toCategoryQueryParams(query: CategoryQuery): HttpParams {
  let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
  for (const key of OPTIONAL_FILTER_KEYS) {
    const value = query[key];
    if (value) {
      params = params.set(key, value);
    }
  }
  return params;
}
