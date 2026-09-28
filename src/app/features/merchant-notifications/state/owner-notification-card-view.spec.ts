import { buildOwnerNotification } from '../testing/owner-notification-fixture';
import { toOwnerNotificationCardView } from './owner-notification-card-view';

describe('toOwnerNotificationCardView', () => {
  it('words a subscription notice with the amber edge and the subscriptions link', () => {
    expect(toOwnerNotificationCardView(buildOwnerNotification())).toEqual({
      id: 'owner-notification-1',
      title: 'تم تفعيل اشتراكك',
      body: 'تم تفعيل باقة "أساسية" بنجاح، ويستمر اشتراكك حتى 20 أكتوبر 2026. يمكنك استعراض تفاصيل المزايا الآن.',
      categoryLabel: 'الاشتراكات',
      edgeTone: 'amber',
      receivedAt: '2026-09-29T09:50:00.000Z',
      isRead: false,
      action: { label: 'عرض في صفحة الاشتراكات والباقات', route: '/merchant/subscription' },
    });
  });

  it('sends a review notice to the reviews page with the green edge', () => {
    const card = toOwnerNotificationCardView(buildOwnerNotification({ category: 'reviews' }));

    expect(card.categoryLabel).toBe('التقييمات');
    expect(card.edgeTone).toBe('green');
    expect(card.action).toEqual({
      label: 'عرض المراجعة والرد على العميل',
      route: '/merchant/reviews',
    });
  });

  it('opens the offer it is about for editing, or the offers list when it names none', () => {
    const named = toOwnerNotificationCardView(
      buildOwnerNotification({ category: 'offers', subjectId: 'offer-7' }),
    );
    const unnamed = toOwnerNotificationCardView(
      buildOwnerNotification({ category: 'offers', subjectId: null }),
    );

    expect(named.categoryLabel).toBe('العروض');
    expect(named.action).toEqual({
      label: 'تعديل العرض وإعادة التقديم',
      route: '/merchant/offers/offer-7/edit',
    });
    expect(unnamed.action?.route).toBe('/merchant/offers');
  });

  it('points a platform update at the home page', () => {
    const card = toOwnerNotificationCardView(buildOwnerNotification({ category: 'system' }));

    expect(card.categoryLabel).toBe('تحديثات النظام');
    expect(card.edgeTone).toBe('muted');
    expect(card.action).toEqual({ label: 'استكشاف المزايا الجديدة', route: '/merchant/dashboard' });
  });
});
