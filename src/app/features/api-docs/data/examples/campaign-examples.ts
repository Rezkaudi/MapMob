import type { CampaignSummary } from '../../../../shared/models/campaign-summary';

const STORAGE = 'https://api.mapmob.com.co/storage';

export const CAMPAIGN_SUMMARY = {
  totalCount: 48,
  activeCount: 22,
  scheduledCount: 9,
  endedCount: 17,
} satisfies CampaignSummary;

const OFFER_PLACE = { id: '12', name: 'متجر دمشق المركزي' };

export const OFFER_ROW = {
  id: '2',
  title: 'خصم الشهر',
  place: OFFER_PLACE,
  category: { id: '1', name: 'مواد غذائية' },
  discountPercent: 20,
  startsOn: '2026-09-22',
  endsOn: '2026-12-22',
  status: 'active',
};

export const OFFER_DETAIL = {
  ...OFFER_ROW,
  description: 'خصم 20% على منتجات مختارة',
  scope: 'selectedItems',
  itemIds: ['5', '9'],
  imageUrl: `${STORAGE}/offers/2.png`,
  createdAt: '2026-09-20T09:00:00Z',
  updatedAt: '2026-09-21T12:10:00Z',
};

export const OFFER_FORM_OPTIONS = {
  places: [
    { ...OFFER_PLACE, category: { id: '1', name: 'مواد غذائية' }, address: 'شارع الجلاء، بناء 4' },
  ],
  categories: [
    { id: '1', name: 'مواد غذائية' },
    { id: '2', name: 'مطاعم' },
  ],
};

export const OFFER_FORM = {
  title: 'خصم الشهر',
  discountPercent: 20,
  placeId: '12',
  categoryId: '1',
  startsOn: '2026-09-22',
  endsOn: '2026-12-22',
  status: 'active',
  description: 'خصم 20% على منتجات مختارة',
  scope: 'selectedItems',
  'itemIds[]': ['5', '9'],
  image: '@offer.png',
  isImageRemoved: false,
};

export const AD_ROW = {
  id: '7',
  title: 'إعلان الموسم',
  advertiserType: 'place',
  place: OFFER_PLACE,
  contentType: 'image',
  placement: 'home',
  position: 'topBanner',
  priority: 5,
  startsOn: '2026-09-22',
  endsOn: '2026-12-22',
  status: 'active',
};

export const AD_DETAIL = {
  ...AD_ROW,
  text: 'تسوق الآن واحصل على خصم 20%',
  mediaUrl: `${STORAGE}/ads/7.png`,
  metrics: { impressions: 48250, clicks: 3860, uniqueUsers: 9130 },
  createdAt: '2026-09-20T08:00:00Z',
  updatedAt: '2026-09-27T14:25:00Z',
  updatedBy: { id: '1', name: 'Obedah' },
};

export const AD_FORM_OPTIONS = { places: [OFFER_PLACE] };

export const AD_FORM = {
  title: 'إعلان الموسم',
  advertiserType: 'place',
  placeId: '12',
  contentType: 'image',
  text: 'تسوق الآن واحصل على خصم 20%',
  placement: 'home',
  position: 'topBanner',
  startsOn: '2026-09-22',
  endsOn: '2026-12-22',
  priority: 5,
  status: 'active',
  media: '@banner.png',
  isMediaRemoved: false,
};
