import { PagedQuery } from '../models/paged-query';

/** For a list without a total: a full page means there may be one more page to open. */
export function guessTotalCount(query: PagedQuery, rowCount: number): number {
  const rowsBefore = query.pageIndex * query.pageSize;
  const hasMoreRows = rowCount === query.pageSize;
  return rowsBefore + rowCount + (hasMoreRows ? 1 : 0);
}
