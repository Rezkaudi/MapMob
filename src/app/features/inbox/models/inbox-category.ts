/** The kind of event a notification reports. The design draws البلاغات and الاشتراكات. */
export type InboxCategory = 'complaints' | 'subscriptions' | 'offers' | 'system';

export const INBOX_CATEGORY_LABELS: Record<InboxCategory, string> = {
  complaints: 'البلاغات',
  subscriptions: 'الاشتراكات',
  offers: 'العروض',
  system: 'تحديثات النظام',
};
