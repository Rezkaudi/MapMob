import { paginate } from '../../../../mock/paginate';
import { PagedResult } from '../../../core/models/paged-result';
import { Place } from '../models/place';
import { PlaceQuery } from '../models/place-query';
import { PlaceSort } from '../models/place-sort';
import { PlaceStatus } from '../models/place-status';
import { PlaceStatusCounts } from '../models/place-status-counts';

function compareBy(sort: PlaceSort): (left: Place, right: Place) => number {
  if (sort === 'rating') {
    return (left, right) => right.rating - left.rating;
  }
  if (sort === 'name') {
    return (left, right) => left.name.localeCompare(right.name, 'ar');
  }
  const direction = sort === 'oldest' ? 1 : -1;
  return (left, right) => direction * left.joinedAt.localeCompare(right.joinedAt);
}

function matches(place: Place, query: PlaceQuery): boolean {
  if (query.status && place.status !== query.status) {
    return false;
  }
  if (query.category && place.category !== query.category) {
    return false;
  }
  if (query.package && place.package !== query.package) {
    return false;
  }
  return !query.search || place.name.includes(query.search) || place.city.includes(query.search);
}

export function filterPlaces(places: readonly Place[], query: PlaceQuery): readonly Place[] {
  const matching = places.filter((place) => matches(place, query));
  return query.sort ? [...matching].sort(compareBy(query.sort)) : matching;
}

export function queryPlaces(places: readonly Place[], query: PlaceQuery): PagedResult<Place> {
  return paginate(filterPlaces(places, query), query.pageIndex, query.pageSize);
}

export function countPlacesByStatus(places: readonly Place[]): PlaceStatusCounts {
  const countOf = (status: PlaceStatus): number =>
    places.filter((place) => place.status === status).length;
  return {
    all: places.length,
    active: countOf('active'),
    pending: countOf('pending'),
    suspended: countOf('suspended'),
  };
}
