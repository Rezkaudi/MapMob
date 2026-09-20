import { HttpParams } from '@angular/common/http';
import { PlaceQuery } from '../models/place-query';

export function toPlaceQueryParams(query: PlaceQuery): HttpParams {
  let params = new HttpParams().set('pageIndex', query.pageIndex).set('pageSize', query.pageSize);
  const filters = {
    search: query.search,
    status: query.status,
    category: query.category,
    package: query.package,
    sort: query.sort,
  };
  for (const [name, value] of Object.entries(filters)) {
    if (value) {
      params = params.set(name, value);
    }
  }
  return params;
}
