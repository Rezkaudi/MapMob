/** The life of an offer or an ad: its days decide the first three, the admin sets the last two. */
export type CampaignStatus = 'active' | 'scheduled' | 'paused' | 'expired' | 'draft';

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  active: 'نشط',
  scheduled: 'قادم',
  paused: 'متوقف',
  expired: 'منتهي',
  draft: 'مسودة',
};
