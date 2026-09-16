import { Ad } from '../models/ad';
import { AdDetail } from '../models/ad-detail';
import { AdDraft } from '../models/ad-draft';

export function buildAd(overrides: Partial<Ad> = {}): Ad {
  return {
    id: 'ad-1',
    title: 'خصم 30% على جميع الأزياء الشتوية',
    advertiserType: 'place',
    placeName: 'ألبسة الفاخر',
    contentType: 'image',
    placement: 'home',
    priority: 5,
    startsOn: '2024-01-12',
    endsOn: '2024-01-26',
    status: 'active',
    ...overrides,
  };
}

export function buildAdDetail(overrides: Partial<AdDetail> = {}): AdDetail {
  return {
    ad: buildAd({ id: 'ad-2', title: 'حملة الصيف لصيدلية الحياة', placeName: 'صيدلية الحياة' }),
    placeId: 'place-3',
    position: 'topBanner',
    text: 'خصم 25% على جميع منتجات العناية بالبشرة والمستلزمات الصيفية طوال الشهر الحالي في جميع الفروع.',
    mediaUrl: null,
    ...overrides,
  };
}

export function buildAdDraft(overrides: Partial<AdDraft> = {}): AdDraft {
  return {
    title: 'حملة الصيف لصيدلية الحياة',
    advertiserType: 'place',
    placeId: 'place-3',
    contentType: 'image',
    text: 'خصم 25% على جميع منتجات العناية بالبشرة.',
    placement: 'home',
    position: 'topBanner',
    startsOn: '2026-10-15',
    endsOn: '2026-10-30',
    priority: 5,
    status: 'active',
    media: null,
    isMediaRemoved: false,
    ...overrides,
  };
}
