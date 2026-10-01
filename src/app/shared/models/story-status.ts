/** `hidden` is set by an admin; `expired` comes from the clock, 24 hours after publishing. */
export type StoryStatus = 'active' | 'hidden' | 'expired';

export const STORY_STATUS_LABELS: Record<StoryStatus, string> = {
  active: 'نشطة',
  hidden: 'مخفية',
  expired: 'منتهية',
};
