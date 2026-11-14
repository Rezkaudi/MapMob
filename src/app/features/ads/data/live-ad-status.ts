import { AdAdvertiserType } from '../models/ad-advertiser-type';

export const LIVE_ACTIVE_AD_STATUS = 'active';
/** The server keeps a paused ad as "inactive". */
export const LIVE_PAUSED_AD_STATUS = 'inactive';
export const LIVE_EXPIRED_AD_STATUS = 'expired';
export const LIVE_SCHEDULED_AD_STATUS = 'scheduled';
export const LIVE_STORE_ADVERTISER_TYPE = 'store';
export const LIVE_ADMIN_ADVERTISER_TYPE = 'admin';

/** The server saves a store's ad as "store" (not Postman's "company") and an app ad as "admin". */
export const LIVE_ADVERTISER_TYPE: Record<AdAdvertiserType, string> = {
  place: LIVE_STORE_ADVERTISER_TYPE,
  admin: LIVE_ADMIN_ADVERTISER_TYPE,
};
