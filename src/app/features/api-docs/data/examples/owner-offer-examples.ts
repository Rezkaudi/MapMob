import type { MerchantOffer } from '../../../merchant-offers/models/merchant-offer';
import type { MerchantOfferCatalog } from '../../../merchant-offers/models/merchant-offer-catalog';

export const OWNER_OFFER = {
  id: '12',
  title: 'خصم 30% على جميع الأزياء الشتوية',
  description: 'احصل على خصم فوري بنسبة 30 % على كامل تشكيلة الشتاء لعام 2026.',
  discountPercent: 30,
  scope: 'allItems',
  itemIds: [],
  startsOn: '2026-09-01',
  endsOn: '2026-09-15',
  status: 'active',
  imageUrl: 'https://cdn.mapmob.sy/storage/offers/12.jpg',
  createdAt: '2026-08-28T09:30:00Z',
} satisfies MerchantOffer;

export const OWNER_OFFER_CATALOG = {
  plan: { id: '1', name: 'الباقة المجانية' },
  activeOfferLimit: 5,
  items: [
    OWNER_OFFER,
    {
      id: '13',
      title: 'خصم 30% على موسم الخريف',
      description: 'خصم على منتجات العناية المختارة.',
      discountPercent: 30,
      scope: 'selectedItems',
      itemIds: ['5', '6', '7'],
      startsOn: '2026-10-01',
      endsOn: '2026-10-20',
      status: 'scheduled',
      imageUrl: null,
      createdAt: '2026-09-20T11:00:00Z',
    },
  ],
} satisfies MerchantOfferCatalog;

export const OWNER_OFFER_FORM = {
  title: 'خصم 30% على موسم الخريف',
  discountPercent: 30,
  startsOn: '2026-10-01',
  endsOn: '2026-10-20',
  status: 'active',
  description: 'خصم على منتجات العناية المختارة.',
  scope: 'selectedItems',
  'itemIds[]': ['5', '6', '7'],
  image: '@offer.jpg',
  isImageRemoved: false,
};
