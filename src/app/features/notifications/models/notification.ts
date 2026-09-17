import { NotificationAudience } from './notification-audience';
import { NotificationKind } from './notification-kind';
import { NotificationStatus } from './notification-status';
import { RecipientMode } from './recipient-mode';

/** Named so it does not clash with the browser's own `Notification`. */
export interface AppNotification {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly audience: NotificationAudience;
  readonly recipientMode: RecipientMode;
  readonly kind: NotificationKind;
  readonly status: NotificationStatus;
  /** Damascus wall-clock time written `yyyy-mm-ddThh:mm`; `null` for a draft with no time yet. */
  readonly sendAt: string | null;
  readonly recipientCount: number;
}
