import { Observable, concat, map, of, switchMap, toArray } from 'rxjs';

const FIRST_PAGE = 1;

/** A page that gives its rows in `items` and the count of all rows in `totalCount`. */
export interface LiveCountedPage<T> {
  readonly items: readonly T[];
  readonly totalCount: number;
}

/** Reads the first page, works out how many pages the total needs, then reads the rest in turn. */
export function readAllCountedPages<T>(
  readPage: (page: number) => Observable<LiveCountedPage<T>>,
  pageSize: number,
): Observable<readonly T[]> {
  return readPage(FIRST_PAGE).pipe(
    switchMap((first) => {
      const pageCount = Math.ceil(first.totalCount / pageSize);
      const laterPages = Array.from({ length: Math.max(pageCount - FIRST_PAGE, 0) }, (_, index) =>
        readPage(FIRST_PAGE + 1 + index),
      );
      return concat(of(first), ...laterPages).pipe(toArray());
    }),
    map((pages) => pages.flatMap((page) => page.items)),
  );
}
