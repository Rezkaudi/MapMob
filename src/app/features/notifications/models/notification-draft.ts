import { NotificationAudience } from './notification-audience';
import { RecipientMode } from './recipient-mode';

/** "حفظ الإشعار" sends or schedules it; "حفظ كمسودة" keeps it as a draft. */
export type NotificationSaveIntent = 'publish' | 'draft';

/** What the create and edit form sends. */
export interface NotificationDraft {
  readonly title: string;
  readonly body: string;
  readonly audience: NotificationAudience;
  readonly recipientMode: RecipientMode;
  /** Only read when the recipients are picked by place. */
  readonly governorateId: string | null;
  readonly areaId: string | null;
  /** Only read when the recipients are picked one by one. */
  readonly recipientIds: readonly string[];
  /** Damascus wall-clock time `yyyy-mm-ddThh:mm`; `null` sends straight away. */
  readonly sendAt: string | null;
  readonly intent: NotificationSaveIntent;
  /** A newly picked picture; `null` keeps the saved one unless `isImageRemoved`. */
  readonly image: File | null;
  readonly isImageRemoved: boolean;
}
