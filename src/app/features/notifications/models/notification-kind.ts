/** "عام" goes to everyone in the audience; "خاص" to picked people or a place. */
export type NotificationKind = 'general' | 'private';

export const NOTIFICATION_KIND_LABELS: Record<NotificationKind, string> = {
  general: 'عام',
  private: 'خاص',
};
