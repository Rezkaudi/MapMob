import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { PagedResult } from '../../../core/models/paged-result';
import { Offer } from '../models/offer';
import { OfferQuery } from '../models/offer-query';

export function filterOffers(offers: readonly Offer[], query: OfferQuery): readonly Offer[] {
  const matching = offers.filter((offer) => matchesFilters(offer, query));
  return sortListEntries(
    matching,
    query.sort,
    (offer) => offer.startsOn,
    (offer) => offer.title,
  );
}

export function queryOffers(offers: readonly Offer[], query: OfferQuery): PagedResult<Offer> {
  return paginate(filterOffers(offers, query), query.pageIndex, query.pageSize);
}

function matchesSearch(offer: Offer, search: string | undefined): boolean {
  const term = search?.trim();
  return !term || [offer.title, offer.placeName].some((field) => field.includes(term));
}

function runsWithin(offer: Offer, query: OfferQuery): boolean {
  if (query.runningFrom && offer.endsOn < query.runningFrom) {
    return false;
  }
  return !query.runningTo || offer.startsOn <= query.runningTo;
}

function matchesFilters(offer: Offer, query: OfferQuery): boolean {
  if (query.status && offer.status !== query.status) {
    return false;
  }
  return matchesSearch(offer, query.search) && runsWithin(offer, query);
}
