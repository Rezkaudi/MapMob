/** What a merchant notification is about. The frame draws الاشتراكات and التقييمات cards. */
export type OwnerNotificationCategory = 'subscriptions' | 'reviews' | 'offers' | 'system';

export const OWNER_NOTIFICATION_CATEGORY_LABELS: Record<OwnerNotificationCategory, string> = {
  subscriptions: 'الاشتراكات',
  reviews: 'التقييمات',
  offers: 'العروض',
  system: 'تحديثات النظام',
};
