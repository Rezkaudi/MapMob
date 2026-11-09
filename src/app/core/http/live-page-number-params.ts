import { HttpParams } from '@angular/common/http';
import { PagedQuery } from '../models/paged-query';

/** The server pages the list: it gets the table's page (counted from one) and its size. */
export function withPageNumber(params: HttpParams, query: PagedQuery): HttpParams {
  return params.set('page', query.pageIndex + 1).set('per_page', query.pageSize);
}
