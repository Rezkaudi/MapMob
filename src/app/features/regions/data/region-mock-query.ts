import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { PagedResult } from '../../../core/models/paged-result';
import { GovernorateQuery } from '../models/governorate-query';

interface SearchableEntry {
  readonly name: string;
  readonly updatedAt: string;
}

export function queryRegionEntries<T extends SearchableEntry>(
  entries: readonly T[],
  query: GovernorateQuery,
): PagedResult<T> {
  const search = query.search?.trim();
  const matching = search ? entries.filter((entry) => entry.name.includes(search)) : entries;
  return paginate(sortListEntries(matching, query.sort), query.pageIndex, query.pageSize);
}
