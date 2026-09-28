import { ListSort } from '../../../shared/models/list-sort';
import { DateRange } from '../../../shared/models/date-range';
import { resolveDatePeriodRange } from '../../../shared/state/date-period-range';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferFilters } from '../models/merchant-offer-filters';

type OfferComparer = (first: MerchantOffer, second: MerchantOffer) => number;

const byCreatedAt: OfferComparer = (first, second) =>
  first.createdAt.localeCompare(second.createdAt);

const OFFER_COMPARERS: Record<ListSort, OfferComparer> = {
  newest: (first, second) => byCreatedAt(second, first),
  oldest: byCreatedAt,
  name: (first, second) => first.title.localeCompare(second.title, 'ar'),
};

export interface MerchantOfferListQuery {
  readonly search: string;
  readonly sort: ListSort | null;
  readonly filters: MerchantOfferFilters;
  /** `yyyy-mm-dd`, for the "اليوم" and "آخر … أيام" periods. */
  readonly today: string;
}

/** An open or half-picked range keeps everything. */
function runsDuring(offer: MerchantOffer, range: DateRange): boolean {
  if (!range.from || !range.to) {
    return true;
  }
  return offer.startsOn <= range.to && offer.endsOn >= range.from;
}

/** A place has a few dozen offers at most, so the page searches, filters and sorts them itself. */
export function filterMerchantOffers(
  offers: readonly MerchantOffer[],
  query: MerchantOfferListQuery,
): readonly MerchantOffer[] {
  const { filters } = query;
  const term = query.search.trim().toLocaleLowerCase();
  const range = resolveDatePeriodRange(
    filters.period,
    filters.customRange,
    new Date(`${query.today}T00:00:00Z`),
  );
  const matching = offers.filter(
    (offer) =>
      (!term || offer.title.toLocaleLowerCase().includes(term)) &&
      (filters.status === null || offer.status === filters.status) &&
      (filters.scope === null || offer.scope === filters.scope) &&
      runsDuring(offer, range),
  );
  return query.sort ? [...matching].sort(OFFER_COMPARERS[query.sort]) : matching;
}
