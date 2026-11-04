/** The life of an offer or an ad: its days decide the most, the admin can pause it. */
export type CampaignStatus = 'active' | 'scheduled' | 'paused' | 'expired';

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  active: 'نشط',
  scheduled: 'قادم',
  paused: 'متوقف',
  expired: 'منتهي',
};
