import { OwnerNotificationCategory } from './owner-notification-category';

/** One notification the store owner received. */
export interface OwnerNotification {
  readonly id: string;
  readonly category: OwnerNotificationCategory;
  readonly title: string;
  readonly body: string;
  /** ISO moment the notification arrived, shown as "منذ 10 دقائق". */
  readonly receivedAt: string;
  readonly isRead: boolean;
  /** The offer or review the notification is about; null when it names none. */
  readonly subjectId: string | null;
}
