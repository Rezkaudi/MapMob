import { NotificationPriority } from './notification-priority';

export interface NotificationDraft {
  readonly title: string;
  readonly priority: NotificationPriority;
  readonly message: string;
  readonly shouldSendToDashboard: boolean;
}
