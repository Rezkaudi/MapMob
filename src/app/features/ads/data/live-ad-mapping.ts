import { toIsoDay } from '../../../shared/formatting/iso-day';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { CampaignSummary } from '../../../shared/models/campaign-summary';
import { resolveRunningStatus } from '../../../shared/state/campaign-running-status';
import { Ad } from '../models/ad';
import { AdDetail } from '../models/ad-detail';
import { AdPriority } from '../models/ad-priority';
import { LiveAd } from './live-ad';
import { toAdPlacement } from './live-ad-placement';
import {
  LIVE_ACTIVE_AD_STATUS,
  LIVE_EXPIRED_AD_STATUS,
  LIVE_STORE_ADVERTISER_TYPE,
} from './live-ad-status';
import { LiveAdSummary } from './live-ad-summary';

const LOWEST_PRIORITY = 1;
const HIGHEST_PRIORITY = 5;
const VIDEO_MEDIA_TYPE = 'video';
// The server has no banner position and no editor name; only admins edit ads.
const DEFAULT_POSITION = 'topBanner';
const EDITOR_NAME = 'Admin';

// The server allows any number; the panel ranks 1 to 5.
function toAdPriority(priority: number): AdPriority {
  return Math.min(HIGHEST_PRIORITY, Math.max(LOWEST_PRIORITY, priority)) as AdPriority;
}

function toAdStatus(ad: LiveAd, today: string): CampaignStatus {
  if (ad.status === LIVE_EXPIRED_AD_STATUS) {
    return 'expired';
  }
  if (ad.status !== LIVE_ACTIVE_AD_STATUS) {
    return 'paused';
  }
  return resolveRunningStatus(
    { startsOn: toIsoDay(ad.starts_at), endsOn: ad.ends_at === null ? null : toIsoDay(ad.ends_at) },
    today,
  );
}

/** `today` is a calendar day written `yyyy-mm-dd`. */
export function toAd(ad: LiveAd, today: string): Ad {
  const isStoreAd = ad.advertiser_type === LIVE_STORE_ADVERTISER_TYPE;
  return {
    id: String(ad.id),
    title: ad.title,
    advertiserType: isStoreAd ? 'place' : 'admin',
    placeName: isStoreAd ? (ad.store?.name ?? null) : null,
    contentType: ad.media?.[0]?.type === VIDEO_MEDIA_TYPE ? 'video' : 'image',
    placement: toAdPlacement(ad.placement),
    priority: toAdPriority(ad.priority),
    startsOn: toIsoDay(ad.starts_at),
    endsOn: ad.ends_at === null ? null : toIsoDay(ad.ends_at),
    status: toAdStatus(ad, today),
  };
}

export function toAdDetail(ad: LiveAd, today: string): AdDetail {
  return {
    ad: toAd(ad, today),
    placeId: ad.store === null ? null : String(ad.store.id),
    position: DEFAULT_POSITION,
    text: ad.description ?? '',
    mediaUrl: ad.media?.[0]?.url ?? null,
    createdOn: toIsoDay(ad.created_at),
    updatedOn: toIsoDay(ad.updated_at),
    updatedBy: EDITOR_NAME,
    // The server does not count unique viewers yet.
    metrics: {
      impressions: ad.views_count ?? 0,
      clicks: ad.clicks_count ?? 0,
      uniqueUsers: 0,
    },
  };
}

export function toAdSummary(summary: LiveAdSummary): CampaignSummary {
  return {
    totalCount: summary.total,
    activeCount: summary.active,
    scheduledCount: summary.upcoming,
    endedCount: summary.expired,
  };
}
