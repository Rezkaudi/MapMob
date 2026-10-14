import { HttpParams } from '@angular/common/http';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { ListSort } from '../../../shared/models/list-sort';
import { AdQuery } from '../models/ad-query';
import { toLiveAdPlacement } from './live-ad-placement';
import {
  LIVE_ACTIVE_AD_STATUS,
  LIVE_EXPIRED_AD_STATUS,
  LIVE_PAUSED_AD_STATUS,
} from './live-ad-status';

// Newest first is what the server does when no sort is sent.
const LIVE_SORT: Record<ListSort, string | null> = {
  newest: null,
  oldest: 'oldest',
  name: 'name_asc',
};

// The server has no day filters for ads, so running and coming ads are both "active".
const LIVE_STATUS: Record<CampaignStatus, string> = {
  active: LIVE_ACTIVE_AD_STATUS,
  scheduled: LIVE_ACTIVE_AD_STATUS,
  paused: LIVE_PAUSED_AD_STATUS,
  expired: LIVE_EXPIRED_AD_STATUS,
  // The server keeps no drafts, so this word finds none, which is the right answer.
  draft: 'draft',
};

/** The filters the list and the export share. */
export function toAdFilterParams(query: AdQuery): HttpParams {
  const filters = {
    search: query.search,
    sort_by: query.sort ? LIVE_SORT[query.sort] : null,
    status: query.status ? LIVE_STATUS[query.status] : null,
    placement: query.placement ? toLiveAdPlacement(query.placement) : null,
  };
  let params = new HttpParams();
  for (const [name, value] of Object.entries(filters)) {
    if (value) {
      params = params.set(name, value);
    }
  }
  return params;
}

export function toAdQueryParams(query: AdQuery): HttpParams {
  return toAdFilterParams(query).set('page', query.pageIndex + 1).set('per_page', query.pageSize);
}
