import { HttpParams } from '@angular/common/http';
import { ListQuery } from '../../shared/models/list-query';
import { ListSort } from '../../shared/models/list-sort';

// Newest first is what the server does when no sort is sent.
const LIVE_SORT: Record<ListSort, string | null> = {
  newest: null,
  oldest: 'oldest',
  name: 'name_asc',
};

export function toLivePageParams(query: ListQuery): HttpParams {
  let params = new HttpParams().set('page', query.pageIndex + 1).set('per_page', query.pageSize);
  if (query.search) {
    params = params.set('search', query.search);
  }
  const sort = query.sort ? LIVE_SORT[query.sort] : null;
  if (sort) {
    params = params.set('sort_by', sort);
  }
  return params;
}
