import { HttpParams } from '@angular/common/http';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { toLiveSort } from '../../../core/http/live-list-sort';
import { LIVE_INACTIVE } from '../../../shared/data/live-owner-status';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { MerchantOfferQuery } from '../models/merchant-offer-query';

// The server keeps a paused offer as "inactive"; the other words are the panel's own.
const LIVE_STATUS: Record<CampaignStatus, string> = {
  active: 'active',
  scheduled: 'scheduled',
  expired: 'expired',
  paused: LIVE_INACTIVE,
};

export function toOwnerOfferQueryParams(query: MerchantOfferQuery): HttpParams {
  return toLiveFilterParams({
    search: query.search.trim(),
    sort_by: toLiveSort(query.sort),
    status: query.status ? LIVE_STATUS[query.status] : null,
    scope: query.scope,
    running_from: query.runningFrom,
    running_to: query.runningTo,
  });
}
