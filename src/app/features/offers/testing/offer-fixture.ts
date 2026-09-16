import { Offer } from '../models/offer';
import { OfferDetail } from '../models/offer-detail';
import { OfferDraft } from '../models/offer-draft';

export function buildOffer(overrides: Partial<Offer> = {}): Offer {
  return {
    id: 'offer-1',
    title: 'خصم 30% على جميع الأزياء الشتوية',
    placeName: 'ألبسة الفاخر',
    categoryName: 'ألبسة',
    startsOn: '2024-01-12',
    endsOn: '2024-01-26',
    status: 'active',
    ...overrides,
  };
}

export function buildOfferDetail(overrides: Partial<OfferDetail> = {}): OfferDetail {
  return {
    offer: buildOffer({
      id: 'offer-2',
      placeName: 'ألبسة الجمال',
      startsOn: '2026-09-01',
      endsOn: '2026-09-15',
    }),
    description: 'احصل على خصم فوري بنسبة 30 % على كامل تشكيلة الشتاء لعام 2026.',
    place: {
      id: 'place-7',
      name: 'ألبسة الجمال',
      categoryName: 'ألبسة',
      address: 'طرطوس،طرطوس المدينة، شارع الثورة',
    },
    discountPercent: 30,
    scope: 'selectedItems',
    itemIds: ['place-7-item-1', 'place-7-item-2'],
    imageUrl: null,
    ...overrides,
  };
}

export function buildOfferDraft(overrides: Partial<OfferDraft> = {}): OfferDraft {
  return {
    title: 'خصم 30% على جميع المنتجات',
    discountPercent: 30,
    placeId: 'place-7',
    categoryName: 'ألبسة',
    startsOn: '2026-09-01',
    endsOn: '2026-09-30',
    status: 'active',
    description: 'خصم على كامل التشكيلة.',
    scope: 'selectedItems',
    itemIds: ['place-7-item-1'],
    image: null,
    isImageRemoved: false,
    ...overrides,
  };
}
