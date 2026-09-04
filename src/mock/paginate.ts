import { PagedResult } from '../app/core/models/paged-result';

export function paginate<T>(
  items: readonly T[],
  pageIndex: number,
  pageSize: number,
): PagedResult<T> {
  const start = pageIndex * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    totalCount: items.length,
  };
}
