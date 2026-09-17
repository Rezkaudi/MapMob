import { NotificationSummary } from '../models/notification-summary';

const ICON = 'notifications';

export interface NotificationStatCard {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
}

/** RTL puts the first card on the right, where the design leads with the total. */
export function buildNotificationStatCards(
  summary: NotificationSummary | null,
): readonly NotificationStatCard[] {
  return [
    { label: 'إجمالي الإشعارات', value: `${summary?.totalCount ?? 0}`, icon: ICON },
    { label: 'إشعارات تم إرسالها', value: `${summary?.sentCount ?? 0}`, icon: ICON },
    { label: 'إشعارات تم جدولتها', value: `${summary?.scheduledCount ?? 0}`, icon: ICON },
    { label: 'مسودة', value: `${summary?.draftCount ?? 0}`, icon: ICON },
  ];
}
