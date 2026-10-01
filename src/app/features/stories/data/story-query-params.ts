import { HttpParams } from '@angular/common/http';
import { StoryQuery } from '../models/story-query';

/** The filters alone, as the export sends them. */
export function toStoryFilterParams(query: StoryQuery): HttpParams {
  let params = new HttpParams();
  if (query.search) {
    params = params.set('search', query.search);
  }
  if (query.status) {
    params = params.set('status', query.status);
  }
  return params;
}

export function toStoryQueryParams(query: StoryQuery): HttpParams {
  return toStoryFilterParams(query)
    .set('pageIndex', query.pageIndex)
    .set('pageSize', query.pageSize);
}
