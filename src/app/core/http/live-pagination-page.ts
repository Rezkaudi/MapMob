import { PagedResult } from '../models/paged-result';

/** The page shape of the newer server routes (ads, payments): the total sits in `pagination`. */
export interface LivePaginationPage<T> {
  readonly data: readonly T[];
  readonly pagination: { readonly total: number };
}

export function toPagedResultFromPagination<TRow, TItem>(
  page: LivePaginationPage<TRow>,
  toItem: (row: TRow) => TItem,
): PagedResult<TItem> {
  return { items: page.data.map(toItem), totalCount: page.pagination.total };
}
