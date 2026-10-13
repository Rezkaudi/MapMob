import { HttpParams } from '@angular/common/http';
import { UserQuery } from '../models/user-query';

// The same route also lists admins; the page shows app users only.
const APP_USER_ROLE = 'customer';

/** The filters the list and the export share. The server has no sort or sign-up date filter yet. */
export function toUserFilterParams(query: UserQuery): HttpParams {
  let params = new HttpParams().set('role', APP_USER_ROLE);
  if (query.search) {
    params = params.set('search', query.search);
  }
  if (query.status) {
    params = params.set('status', query.status);
  }
  return params;
}

export function toUserQueryParams(query: UserQuery): HttpParams {
  return toUserFilterParams(query)
    .set('page', query.pageIndex + 1)
    .set('per_page', query.pageSize);
}
