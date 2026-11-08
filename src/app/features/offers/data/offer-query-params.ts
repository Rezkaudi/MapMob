import { HttpParams } from '@angular/common/http';
import { addCalendarDays } from '../../../shared/formatting/calendar-day';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { OfferQuery } from '../models/offer-query';
import { LIVE_ACTIVE_OFFER_STATUS, LIVE_PAUSED_OFFER_STATUS } from './live-offer-status';

interface LiveOfferFilters {
  readonly status?: string;
  /** Inclusive calendar days, written `yyyy-mm-dd`. */
  readonly starts_from?: string;
  readonly starts_to?: string;
  readonly ends_from?: string;
  readonly ends_to?: string;
}

/** The server knows active and inactive only, so the days tell coming, running and ended apart. */
function toStatusFilters(status: CampaignStatus, today: string): LiveOfferFilters {
  switch (status) {
    case 'paused':
      return { status: LIVE_PAUSED_OFFER_STATUS };
    case 'scheduled':
      return { status: LIVE_ACTIVE_OFFER_STATUS, starts_from: addCalendarDays(today, 1) };
    case 'expired':
      return { status: LIVE_ACTIVE_OFFER_STATUS, ends_to: addCalendarDays(today, -1) };
    case 'active':
      return { status: LIVE_ACTIVE_OFFER_STATUS, starts_to: today, ends_from: today };
  }
}

function earlierDay(first?: string, second?: string): string | undefined {
  return first && second ? (first < second ? first : second) : (first ?? second);
}

function laterDay(first?: string, second?: string): string | undefined {
  return first && second ? (first > second ? first : second) : (first ?? second);
}

/** The filters the list and the export share. `today` is written `yyyy-mm-dd`. */
export function toOfferFilterParams(query: OfferQuery, today: string): HttpParams {
  const byStatus = query.status ? toStatusFilters(query.status, today) : {};
  return toLiveFilterParams({
    search: query.search,
    sort_by: toLiveSort(query.sort),
    ...byStatus,
    // An offer runs inside a range when it starts by the last day and ends on or after the first.
    starts_to: earlierDay(byStatus.starts_to, query.runningTo),
    ends_from: laterDay(byStatus.ends_from, query.runningFrom),
  });
}

export function toOfferQueryParams(query: OfferQuery, today: string): HttpParams {
  return toOfferFilterParams(query, today)
    .set('page', query.pageIndex + 1)
    .set('per_page', query.pageSize);
}
