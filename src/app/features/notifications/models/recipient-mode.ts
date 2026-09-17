import { NotificationAudience } from './notification-audience';

export type RecipientMode = 'all' | 'selected' | 'location';

export const RECIPIENT_MODE_LABELS: Record<NotificationAudience, Record<RecipientMode, string>> = {
  users: {
    all: 'جميع المستخدمين',
    selected: 'مستخدمين محددين',
    location: 'مخصص حسب الموقع',
  },
  companies: {
    all: 'جميع الشركات والمتاجر',
    selected: 'شركات ومتاجر محددة',
    location: 'مخصص حسب الموقع',
  },
};

/** The noun after a count: "1,250 مستخدم". */
export const RECIPIENT_NOUNS: Record<NotificationAudience, string> = {
  users: 'مستخدم',
  companies: 'متجر',
};
