import { ListSort } from '../app/shared/models/list-sort';

interface NamedEntry {
  readonly name: string;
}

interface SortableEntry extends NamedEntry {
  readonly updatedAt: string;
}

type DateOf<T> = (entry: T) => string;
type NameOf<T> = (entry: T) => string;

function compareBy<T>(
  sort: ListSort,
  dateOf: DateOf<T>,
  nameOf: NameOf<T>,
): (left: T, right: T) => number {
  switch (sort) {
    case 'newest':
      return (left, right) => dateOf(right).localeCompare(dateOf(left));
    case 'oldest':
      return (left, right) => dateOf(left).localeCompare(dateOf(right));
    case 'name':
      return (left, right) => nameOf(left).localeCompare(nameOf(right), 'ar');
  }
}

export function sortListEntries<T extends SortableEntry>(
  entries: readonly T[],
  sort: ListSort | undefined,
): readonly T[];
export function sortListEntries<T extends NamedEntry>(
  entries: readonly T[],
  sort: ListSort | undefined,
  dateOf: DateOf<T>,
): readonly T[];
export function sortListEntries<T>(
  entries: readonly T[],
  sort: ListSort | undefined,
  dateOf: DateOf<T>,
  nameOf: NameOf<T>,
): readonly T[];
export function sortListEntries<T>(
  entries: readonly T[],
  sort: ListSort | undefined,
  dateOf: DateOf<T> = (entry) => (entry as unknown as SortableEntry).updatedAt,
  nameOf: NameOf<T> = (entry) => (entry as unknown as NamedEntry).name,
): readonly T[] {
  return sort ? [...entries].sort(compareBy(sort, dateOf, nameOf)) : entries;
}
