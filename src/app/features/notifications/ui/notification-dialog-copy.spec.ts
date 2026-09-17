import { buildNotification } from '../testing/notification-fixture';
import { buildNotificationDeleteCopy } from './notification-dialog-copy';

describe('buildNotificationDeleteCopy', () => {
  it('names the notification in a red delete question', () => {
    expect(buildNotificationDeleteCopy(buildNotification({ title: 'عرض جديد' }))).toEqual({
      title: 'حذف الإشعار',
      question: 'هل أنت متأكد من حذف إشعار "عرض جديد"؟',
      detail: 'سيتم حذف الإشعار نهائياً من السجل، ولا يمكن التراجع عن ذلك.',
      confirmLabel: 'حذف الإشعار',
      tone: 'danger',
    });
  });
});
