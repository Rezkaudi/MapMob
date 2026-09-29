import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { ListQuery } from '../../../shared/models/list-query';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { DeliveryPlatformPage } from '../models/delivery-platform-page';

/** With no sort picked the table follows the display order the admins set. */
export function queryDeliveryPlatforms(
  platforms: readonly DeliveryPlatformEntry[],
  query: ListQuery,
): DeliveryPlatformPage {
  const search = query.search?.trim().toLowerCase() ?? '';
  const matching = platforms.filter(
    (platform) =>
      platform.name.includes(search) || platform.latinName.toLowerCase().includes(search),
  );
  const inDisplayOrder = [...matching].sort((left, right) => left.sortOrder - right.sortOrder);
  const sorted = sortListEntries(inDisplayOrder, query.sort, (platform) => platform.createdAt);
  return paginate(sorted, query.pageIndex, query.pageSize);
}
