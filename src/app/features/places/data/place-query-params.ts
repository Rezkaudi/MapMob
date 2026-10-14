import { LivePlan } from '../../../shared/data/live-plan';
import { HttpParams } from '@angular/common/http';
import { PlaceQuery } from '../models/place-query';
import { PlaceSort } from '../models/place-sort';
import { toLivePlaceStatus, toLivePlanSlug } from './live-place-mapping';

// Newest first is the server default.
const LIVE_SORT: Record<PlaceSort, string | null> = {
  newest: null,
  oldest: 'oldest',
  name: 'name_asc',
  rating: 'rating_desc',
};

/** The filters the list and the export share. */
export function toPlaceFilterParams(query: PlaceQuery, plans: readonly LivePlan[]): HttpParams {
  const filters = {
    search: query.search,
    status: query.status ? toLivePlaceStatus(query.status) : undefined,
    category_id: query.category,
    plan_tier: query.package ? toLivePlanSlug(query.package, plans) : undefined,
    sort_by: query.sort ? LIVE_SORT[query.sort] : null,
  };
  let params = new HttpParams();
  for (const [name, value] of Object.entries(filters)) {
    if (value) {
      params = params.set(name, value);
    }
  }
  return params;
}

export function toPlaceQueryParams(query: PlaceQuery, plans: readonly LivePlan[]): HttpParams {
  return toPlaceFilterParams(query, plans)
    .set('page', query.pageIndex + 1)
    .set('per_page', query.pageSize);
}
