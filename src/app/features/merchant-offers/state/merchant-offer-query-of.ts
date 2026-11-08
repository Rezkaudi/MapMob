import { ListSort } from '../../../shared/models/list-sort';
import { resolveDatePeriodRange } from '../../../shared/state/date-period-range';
import { MerchantOfferFilters } from '../models/merchant-offer-filters';
import { MerchantOfferQuery } from '../models/merchant-offer-query';

/** The server query for what the page shows; `today` is the clock's moment. */
export function merchantOfferQueryOf(
  search: string,
  sort: ListSort | null,
  filters: MerchantOfferFilters,
  today: Date,
): MerchantOfferQuery {
  const range = resolveDatePeriodRange(filters.period, filters.customRange, today);
  const hasWholeRange = Boolean(range.from && range.to);
  return {
    search,
    sort,
    status: filters.status,
    scope: filters.scope,
    runningFrom: hasWholeRange ? range.from : null,
    runningTo: hasWholeRange ? range.to : null,
  };
}
