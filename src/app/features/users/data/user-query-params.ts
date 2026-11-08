import { HttpParams } from '@angular/common/http';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { UserQuery } from '../models/user-query';

// The same route also lists admins; the page shows app users only.
const APP_USER_ROLE = 'customer';

/** The filters the list and the export share. The sign-up days go as date_from / date_to. */
export function toUserFilterParams(query: UserQuery): HttpParams {
  return toLiveFilterParams({
    role: APP_USER_ROLE,
    search: query.search,
    status: query.status,
    account_type: query.accountType,
    sort_by: toLiveSort(query.sort),
    date_from: query.registeredFrom,
    date_to: query.registeredTo,
  });
}

export function toUserQueryParams(query: UserQuery): HttpParams {
  return toUserFilterParams(query)
    .set('page', query.pageIndex + 1)
    .set('per_page', query.pageSize);
}
