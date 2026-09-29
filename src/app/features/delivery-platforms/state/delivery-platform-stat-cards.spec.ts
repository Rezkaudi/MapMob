import { buildDeliveryPlatformSummary } from '../testing/delivery-platform-fixture';
import { buildDeliveryPlatformStatCards } from './delivery-platform-stat-cards';

describe('buildDeliveryPlatformStatCards', () => {
  it('lists the four cards right to left, as the frame draws them', () => {
    const cards = buildDeliveryPlatformStatCards(
      buildDeliveryPlatformSummary({ referralCount: 12400 }),
    );

    expect(cards).toEqual([
      { label: 'التحويلات إلى منصات التوصيل', value: '12,400', icon: 'external-link-feather' },
      { label: 'المنصة الأكثر استخداماً', value: 'talabat', icon: 'trending-up-feather' },
      { label: 'المتاجر المرتبطة بمنصات طلبات', value: '300', icon: 'building' },
      { label: 'عدد المنصات النشطة', value: '6', icon: 'bell-feather' },
    ]);
  });

  it('shows a dash while no platform has been used', () => {
    const cards = buildDeliveryPlatformStatCards(
      buildDeliveryPlatformSummary({ mostUsedPlatform: null }),
    );

    expect(cards[1].value).toBe('—');
  });

  it('shows zeros before the summary loads', () => {
    expect(buildDeliveryPlatformStatCards(null).map((card) => card.value)).toEqual([
      '0',
      '—',
      '0',
      '0',
    ]);
  });
});
