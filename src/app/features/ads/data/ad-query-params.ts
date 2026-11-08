import { HttpParams } from '@angular/common/http';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { addCalendarDays } from '../../../shared/formatting/calendar-day';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { AdAdvertiserType } from '../models/ad-advertiser-type';
import { AdQuery } from '../models/ad-query';
import { toLiveAdPlacement } from './live-ad-placement';
import {
  LIVE_ACTIVE_AD_STATUS,
  LIVE_EXPIRED_AD_STATUS,
  LIVE_PAUSED_AD_STATUS,
} from './live-ad-status';

// The filter words Postman lists for advertiser_type.
const LIVE_ADVERTISER_TYPE: Record<AdAdvertiserType, string> = {
  place: 'company',
  admin: 'admin',
};

// The server refuses "scheduled", so coming ads are asked for from tomorrow on.
const LIVE_STATUS: Partial<Record<CampaignStatus, string>> = {
  active: LIVE_ACTIVE_AD_STATUS,
  paused: LIVE_PAUSED_AD_STATUS,
  expired: LIVE_EXPIRED_AD_STATUS,
};

function laterDay(first: string | undefined, second: string | undefined): string | undefined {
  return first && second ? (first > second ? first : second) : (first ?? second);
}

/** The filters the list and the export share, with Postman's names. `today` is `yyyy-mm-dd`. */
export function toAdFilterParams(query: AdQuery, today: string): HttpParams {
  const comingFrom = query.status === 'scheduled' ? addCalendarDays(today, 1) : undefined;
  return toLiveFilterParams({
    search: query.search,
    sort_by: toLiveSort(query.sort),
    status: query.status ? LIVE_STATUS[query.status] : null,
    media_type: query.contentType,
    advertiser_type: query.advertiserType ? LIVE_ADVERTISER_TYPE[query.advertiserType] : null,
    placement: query.placement ? toLiveAdPlacement(query.placement) : null,
    date_from: laterDay(comingFrom, query.runningFrom),
    date_to: query.runningTo,
  });
}
