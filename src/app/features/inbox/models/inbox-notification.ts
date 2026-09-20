import { InboxCategory } from './inbox-category';

/** One notification the admin received. */
export interface InboxNotification {
  readonly id: string;
  readonly category: InboxCategory;
  readonly title: string;
  readonly body: string;
  /** ISO moment the notification arrived, shown as "منذ 10 دقائق". */
  readonly receivedAt: string;
  readonly isRead: boolean;
}
