import { CampaignStatus } from './campaign-status';

/** "حالة العرض" offers active or paused. The server works out the rest by date. */
export type OfferSavedStatus = Extract<CampaignStatus, 'active' | 'paused'>;
