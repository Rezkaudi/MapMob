import { NotificationAudience } from '../models/notification-audience';
import { NotificationKind } from '../models/notification-kind';
import { NotificationStatus } from '../models/notification-status';
import { RecipientMode } from '../models/recipient-mode';

/** A notification as the live server sends it. The id is written "n12"; its routes take 12. */
export interface LiveNotification {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly audience: NotificationAudience;
  readonly recipientMode: RecipientMode;
  readonly kind: NotificationKind | null;
  readonly status: NotificationStatus;
  readonly sendAt: string | null;
  readonly sentAt: string | null;
  readonly recipientCount: number | null;
  readonly imageUrl: string | null;
  readonly governorateId: string | null;
  readonly areaId: string | null;
  readonly recipientIds: readonly string[];
}
