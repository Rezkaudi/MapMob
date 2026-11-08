import { HttpParams } from '@angular/common/http';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { CategoryQuery } from '../models/category-query';

// The server reads an empty parent id as "main categories only".
export const MAIN_CATEGORY_PARENT_ID = '';

/** The filters the category list sends. Empty when nothing is picked. */
export function toCategoryFilterParams(query: CategoryQuery): HttpParams {
  const params = toLiveFilterParams({
    search: query.search,
    sort_by: toLiveSort(query.sort),
    is_active: query.status ? Number(query.status === 'active') : null,
    has_parent: query.kind === 'sub' ? 1 : null,
    parent_id: query.parentId,
  });
  return query.kind === 'main' && !query.parentId
    ? params.set('parent_id', MAIN_CATEGORY_PARENT_ID)
    : params;
}
