import { NotificationCardAction } from './notification-card-action';
import { NotificationEdgeTone } from './notification-edge-tone';

/** Everything one notification card shows, already worded for the reader. */
export interface NotificationCardView {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly categoryLabel: string;
  readonly edgeTone: NotificationEdgeTone;
  /** ISO moment the notification arrived, shown as "منذ 10 دقائق". */
  readonly receivedAt: string;
  readonly isRead: boolean;
  readonly action: NotificationCardAction | null;
}
