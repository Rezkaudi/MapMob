import { buildNotification } from '../testing/notification-fixture';
import { buildNotificationDetailView } from './notification-detail-view';

const NOW = new Date(2026, 8, 8, 10, 0);

describe('buildNotificationDetailView', () => {
  it('spells out a scheduled notification and offers to reschedule it', () => {
    expect(buildNotificationDetailView(buildNotification(), NOW)).toEqual({
      kindLabel: 'إشعار عام',
      recipientLabel: 'جميع المستخدمين',
      recipientCountLabel: '1,250 مستخدم',
      sendTimeLabel: '10 سبتمبر 2026- 10:00 صباحاً',
      sendDistanceLabel: 'متبقي يومين',
      primaryAction: { kind: 'reschedule', label: 'إعادة جدولة' },
    });
  });

  it('offers to resend a sent notification', () => {
    const sent = buildNotificationDetailView(
      buildNotification({ status: 'sent', sendAt: '2026-09-01T10:00' }),
      NOW,
    );
    const sentAtOnce = buildNotificationDetailView(
      buildNotification({ status: 'sent', sendAt: null, audience: 'companies', kind: 'private' }),
      NOW,
    );

    expect(sent.primaryAction).toEqual({ kind: 'resend', label: 'إعادة إرسال الإشعار' });
    expect(sent.sendDistanceLabel).toBe('منذ أسبوع');
    expect(sentAtOnce.sendTimeLabel).toBe('لم يحدد بعد');
    expect(sentAtOnce.sendDistanceLabel).toBeNull();
    expect(sentAtOnce.kindLabel).toBe('إشعار خاص');
    expect(sentAtOnce.recipientCountLabel).toBe('1,250 متجر');
  });
});
