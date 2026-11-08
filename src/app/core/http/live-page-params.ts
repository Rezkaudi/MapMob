import { HttpParams } from '@angular/common/http';
import { ListQuery } from '../../shared/models/list-query';
import { toLiveFilterParams } from './live-filter-params';
import { toLiveSort } from './live-list-sort';

export function toLivePageParams(query: ListQuery): HttpParams {
  return toLiveFilterParams({
    page: query.pageIndex + 1,
    per_page: query.pageSize,
    search: query.search,
    sort_by: toLiveSort(query.sort),
  });
}
