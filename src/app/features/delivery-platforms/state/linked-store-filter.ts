import { SelectOption } from '../../../shared/ui/select-field/select-option';
import { LinkedStore } from '../models/linked-store';

export interface LinkedStoreFilter {
  readonly search: string;
  readonly categoryId: string | null;
}

/** The dialog holds the whole list, so it filters in place instead of asking again. */
export function filterLinkedStores(
  stores: readonly LinkedStore[],
  filter: LinkedStoreFilter,
): readonly LinkedStore[] {
  const search = filter.search.trim();
  return stores.filter(
    (store) =>
      (!filter.categoryId || store.category.id === filter.categoryId) &&
      (!search || searchableNames(store).some((name) => name.includes(search))),
  );
}

export function listStoreCategories(stores: readonly LinkedStore[]): readonly SelectOption[] {
  const namesById = new Map(stores.map((store) => [store.category.id, store.category.name]));
  return [...namesById]
    .map(([value, label]) => ({ value, label }))
    .sort((left, right) => left.label.localeCompare(right.label, 'ar'));
}

function searchableNames(store: LinkedStore): readonly string[] {
  return [store.name, store.governorate.name, store.area?.name ?? ''];
}
