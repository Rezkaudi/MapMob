import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { AppNotification } from '../models/notification';

export function buildNotificationDeleteCopy(notification: AppNotification): ConfirmActionCopy {
  return {
    title: 'حذف الإشعار',
    question: `هل أنت متأكد من حذف إشعار "${notification.title}"؟`,
    detail: 'سيتم حذف الإشعار نهائياً من السجل، ولا يمكن التراجع عن ذلك.',
    confirmLabel: 'حذف الإشعار',
    tone: 'danger',
  };
}
