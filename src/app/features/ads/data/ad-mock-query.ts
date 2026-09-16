import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { PagedResult } from '../../../core/models/paged-result';
import { Ad } from '../models/ad';
import { AdQuery } from '../models/ad-query';

type ExactFilter = 'status' | 'contentType' | 'advertiserType' | 'placement';

const EXACT_FILTERS: readonly ExactFilter[] = [
  'status',
  'contentType',
  'advertiserType',
  'placement',
];

export function filterAds(ads: readonly Ad[], query: AdQuery): readonly Ad[] {
  const matching = ads.filter((ad) => matchesFilters(ad, query));
  return sortListEntries(
    matching,
    query.sort,
    (ad) => ad.startsOn,
    (ad) => ad.title,
  );
}

export function queryAds(ads: readonly Ad[], query: AdQuery): PagedResult<Ad> {
  return paginate(filterAds(ads, query), query.pageIndex, query.pageSize);
}

function matchesSearch(ad: Ad, search: string | undefined): boolean {
  const term = search?.trim();
  return !term || [ad.title, ad.placeName ?? ''].some((field) => field.includes(term));
}

function runsWithin(ad: Ad, query: AdQuery): boolean {
  if (query.runningFrom && ad.endsOn !== null && ad.endsOn < query.runningFrom) {
    return false;
  }
  return !query.runningTo || ad.startsOn <= query.runningTo;
}

function matchesFilters(ad: Ad, query: AdQuery): boolean {
  const matchesExact = EXACT_FILTERS.every((key) => !query[key] || ad[key] === query[key]);
  return matchesExact && matchesSearch(ad, query.search) && runsWithin(ad, query);
}
