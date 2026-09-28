import { addCalendarDays, toCalendarDay } from '../../../shared/formatting/calendar-day';
import { MerchantOfferRecord } from './merchant-offer-record';

const DAY_MS = 24 * 60 * 60 * 1000;

/** The frame's three running offers, laid around `now` so they stay running. */
export function buildMerchantOfferSeed(now: Date): readonly MerchantOfferRecord[] {
  const today = toCalendarDay(now);
  const createdDaysAgo = (days: number) => new Date(now.getTime() - days * DAY_MS).toISOString();
  return [
    {
      id: 'offer-1',
      title: 'خصم 30% على جميع الأزياء الشتوية',
      description: 'احصل على خصم فوري بنسبة 30 % على كامل تشكيلة الشتاء لعام 2026.',
      discountPercent: 30,
      scope: 'allItems',
      itemIds: [],
      startsOn: addCalendarDays(today, -7),
      endsOn: addCalendarDays(today, 14),
      isPaused: false,
      isDraft: false,
      imageUrl: '/assets/images/offer-winter-clothes.jpg',
      createdAt: createdDaysAgo(10),
    },
    {
      id: 'offer-2',
      title: 'خصم 30% على موسم الخريف',
      description: 'خصم على منتجات العناية المختارة طوال موسم الخريف.',
      discountPercent: 30,
      scope: 'selectedItems',
      itemIds: ['product-1', 'product-2', 'product-3'],
      startsOn: addCalendarDays(today, -3),
      endsOn: addCalendarDays(today, 11),
      isPaused: false,
      isDraft: false,
      imageUrl: null,
      createdAt: createdDaysAgo(5),
    },
    {
      id: 'offer-3',
      title: 'خصم 15% على جلسات التنظيف',
      description: 'جلسة تنظيف بشرة عميق بخصم 15% لأول زيارة.',
      discountPercent: 15,
      scope: 'selectedItems',
      itemIds: ['product-3'],
      startsOn: today,
      endsOn: addCalendarDays(today, 20),
      isPaused: false,
      isDraft: false,
      imageUrl: null,
      createdAt: createdDaysAgo(1),
    },
  ];
}
