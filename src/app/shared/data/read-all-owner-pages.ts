import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { LiveMetaPage, readAllMetaPages } from '../../core/http/read-all-meta-pages';

// The /owner lists answer 15 rows a page unless asked for more, and refuse more than 50.
const OWNER_PAGE_SIZE = 50;

/** Some /owner lists write their page info in camelCase. */
interface LiveOwnerPage<T> {
  readonly data: readonly T[];
  readonly meta: {
    readonly current_page?: number;
    readonly last_page?: number;
    readonly currentPage?: number;
    readonly lastPage?: number;
  };
}

/** Every row of an /owner list; the pages filter, sort and count on their own. */
export function readAllOwnerPages<T>(
  httpClient: HttpClient,
  url: string,
): Observable<readonly T[]> {
  return readAllMetaPages((page) =>
    httpClient
      .get<LiveOwnerPage<T>>(url, { params: { page, per_page: OWNER_PAGE_SIZE } })
      .pipe(map(toMetaPage)),
  );
}

function toMetaPage<T>({ data, meta }: LiveOwnerPage<T>): LiveMetaPage<T> {
  const currentPage = meta.current_page ?? meta.currentPage ?? 1;
  return {
    data,
    meta: { current_page: currentPage, last_page: meta.last_page ?? meta.lastPage ?? currentPage },
  };
}
