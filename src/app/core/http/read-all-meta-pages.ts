import { EMPTY, Observable, expand, reduce } from 'rxjs';

const FIRST_PAGE = 1;

/** A Laravel page with its place in `meta`. */
export interface LiveMetaPage<T> {
  readonly data: readonly T[];
  readonly meta: { readonly current_page: number; readonly last_page: number };
}

/** For lists that ignore `per_page`: reads page after page until the last one. */
export function readAllMetaPages<T>(
  readPage: (page: number) => Observable<LiveMetaPage<T>>,
): Observable<readonly T[]> {
  return readPage(FIRST_PAGE).pipe(
    expand((page) =>
      page.meta.current_page < page.meta.last_page ? readPage(page.meta.current_page + 1) : EMPTY,
    ),
    reduce<LiveMetaPage<T>, readonly T[]>((all, page) => [...all, ...page.data], []),
  );
}
