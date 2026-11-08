import { ListSort } from '../../shared/models/list-sort';

// The server refuses "newest" by name; "latest" is its word for it.
const LIVE_LIST_SORT: Record<ListSort, string> = {
  newest: 'latest',
  oldest: 'oldest',
  name: 'name_asc',
};

export function toLiveSort(sort: ListSort | null | undefined): string | undefined {
  return sort ? LIVE_LIST_SORT[sort] : undefined;
}
