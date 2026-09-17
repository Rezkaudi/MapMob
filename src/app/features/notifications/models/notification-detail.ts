import { AppNotification } from './notification';

/** What the edit form needs on top of the list row. */
export interface NotificationDetail extends AppNotification {
  readonly imageUrl: string | null;
  /** Only set when the recipients are picked by place. */
  readonly governorateId: string | null;
  readonly areaId: string | null;
  /** Only filled when the recipients are picked one by one. */
  readonly recipientIds: readonly string[];
}
