import { ListSort } from '../app/shared/models/list-sort';

interface SortableEntry {
  readonly name: string;
  readonly updatedAt: string;
}

type EntryComparer = (left: SortableEntry, right: SortableEntry) => number;

const COMPARE_BY_SORT: Record<ListSort, EntryComparer> = {
  newest: (left, right) => right.updatedAt.localeCompare(left.updatedAt),
  oldest: (left, right) => left.updatedAt.localeCompare(right.updatedAt),
  name: (left, right) => left.name.localeCompare(right.name, 'ar'),
};

export function sortListEntries<T extends SortableEntry>(
  entries: readonly T[],
  sort: ListSort | undefined,
): readonly T[] {
  return sort ? [...entries].sort(COMPARE_BY_SORT[sort]) : entries;
}
