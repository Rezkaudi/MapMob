import { LivePlan } from '../../../shared/data/live-plan';
import { HttpParams } from '@angular/common/http';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { PlaceQuery } from '../models/place-query';
import { PlaceSort } from '../models/place-sort';
import { toLivePlaceStatus, toLivePackageSlug } from './live-place-mapping';

// The server refuses "newest" by name; "latest" is its word for it.
const LIVE_SORT: Record<PlaceSort, string> = {
  newest: 'latest',
  oldest: 'oldest',
  name: 'name_asc',
  rating: 'rating_desc',
};

/** The filters the list and the export share. */
export function toPlaceFilterParams(query: PlaceQuery, plans: readonly LivePlan[]): HttpParams {
  return toLiveFilterParams({
    search: query.search,
    status: query.status ? toLivePlaceStatus(query.status) : undefined,
    category_id: query.category,
    plan_tier: query.package ? toLivePackageSlug(query.package, plans) : undefined,
    sort_by: query.sort ? LIVE_SORT[query.sort] : null,
  });
}

export function toPlaceQueryParams(query: PlaceQuery, plans: readonly LivePlan[]): HttpParams {
  return toPlaceFilterParams(query, plans)
    .set('page', query.pageIndex + 1)
    .set('per_page', query.pageSize);
}
