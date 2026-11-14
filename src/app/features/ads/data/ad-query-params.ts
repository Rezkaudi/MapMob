import { HttpParams } from '@angular/common/http';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { AdQuery } from '../models/ad-query';
import { toLiveAdPlacement } from './live-ad-placement';
import {
  LIVE_ACTIVE_AD_STATUS,
  LIVE_EXPIRED_AD_STATUS,
  LIVE_PAUSED_AD_STATUS,
  LIVE_SCHEDULED_AD_STATUS,
  LIVE_ADVERTISER_TYPE,
} from './live-ad-status';

const LIVE_STATUS: Record<CampaignStatus, string> = {
  active: LIVE_ACTIVE_AD_STATUS,
  scheduled: LIVE_SCHEDULED_AD_STATUS,
  paused: LIVE_PAUSED_AD_STATUS,
  expired: LIVE_EXPIRED_AD_STATUS,
};

/** The filters the list and the export share, with Postman's names. */
export function toAdFilterParams(query: AdQuery): HttpParams {
  return toLiveFilterParams({
    search: query.search,
    sort_by: toLiveSort(query.sort),
    status: query.status ? LIVE_STATUS[query.status] : null,
    media_type: query.contentType,
    advertiser_type: query.advertiserType ? LIVE_ADVERTISER_TYPE[query.advertiserType] : null,
    placement: query.placement ? toLiveAdPlacement(query.placement) : null,
    date_from: query.runningFrom,
    date_to: query.runningTo,
  });
}
