import { PagedResult } from '../../../core/models/paged-result';
import { paginate } from '../../../../mock/paginate';
import { GovernorateQuery } from '../models/governorate-query';
import { RegionSort } from '../models/region-sort';

interface SortableEntry {
  readonly name: string;
  readonly updatedAt: string;
}

const COMPARE_BY_SORT: Record<RegionSort, (left: SortableEntry, right: SortableEntry) => number> = {
  newest: (left, right) => right.updatedAt.localeCompare(left.updatedAt),
  oldest: (left, right) => left.updatedAt.localeCompare(right.updatedAt),
  name: (left, right) => left.name.localeCompare(right.name, 'ar'),
};

export function queryRegionEntries<T extends SortableEntry>(
  entries: readonly T[],
  query: GovernorateQuery,
): PagedResult<T> {
  const search = query.search?.trim();
  const matching = search ? entries.filter((entry) => entry.name.includes(search)) : entries;
  const sorted = query.sort ? [...matching].sort(COMPARE_BY_SORT[query.sort]) : matching;
  return paginate(sorted, query.pageIndex, query.pageSize);
}
