import { HttpParams } from '@angular/common/http';
import { NotificationQuery } from '../models/notification-query';

const OPTIONAL_KEYS = [
  'search',
  'sort',
  'audience',
  'kind',
  'status',
  'sentFrom',
  'sentTo',
] as const;

export function toNotificationQueryParams(query: NotificationQuery): HttpParams {
  let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
  for (const key of OPTIONAL_KEYS) {
    const value = query[key];
    if (value) {
      params = params.set(key, value);
    }
  }
  return params;
}
