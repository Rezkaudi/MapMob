import { PagedResult } from '../models/paged-result';

/** A Laravel page: the rows plus `meta.total`. */
export interface LivePage<T> {
  readonly data: readonly T[];
  readonly meta: { readonly total: number };
}

export function toPagedResult<TRow, TItem>(
  page: LivePage<TRow>,
  toItem: (row: TRow) => TItem,
): PagedResult<TItem> {
  return { items: page.data.map(toItem), totalCount: page.meta.total };
}
