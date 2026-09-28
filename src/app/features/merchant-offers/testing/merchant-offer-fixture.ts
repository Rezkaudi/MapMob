import { OfferDraftFields } from '../../../shared/models/offer-draft-fields';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferCatalog } from '../models/merchant-offer-catalog';

export function buildMerchantOffer(overrides: Partial<MerchantOffer> = {}): MerchantOffer {
  return {
    id: 'offer-1',
    title: 'خصم 30% على موسم الخريف',
    description: 'احصل على خصم فوري بنسبة 30 % على كامل تشكيلة الشتاء لعام 2026.',
    discountPercent: 30,
    scope: 'selectedItems',
    itemIds: ['product-1', 'product-2', 'product-3'],
    startsOn: '2026-09-01',
    endsOn: '2026-09-15',
    status: 'active',
    imageUrl: null,
    createdAt: '2026-08-20T09:00:00.000Z',
    ...overrides,
  };
}

export function buildMerchantOfferCatalog(
  overrides: Partial<MerchantOfferCatalog> = {},
): MerchantOfferCatalog {
  return {
    plan: { id: 'plan-free', name: 'الباقة المجانية' },
    activeOfferLimit: 5,
    items: [buildMerchantOffer()],
    ...overrides,
  };
}

export function buildOfferDraftFields(overrides: Partial<OfferDraftFields> = {}): OfferDraftFields {
  return {
    title: 'خصم 30% على جميع المنتجات',
    discountPercent: 30,
    startsOn: '2026-09-01',
    endsOn: '2026-09-30',
    status: 'active',
    description: 'خصم على كامل التشكيلة.',
    scope: 'selectedItems',
    itemIds: ['product-1'],
    image: null,
    isImageRemoved: false,
    ...overrides,
  };
}
