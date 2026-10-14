import { LiveCategory } from '../data/live-category';

export const LIVE_MAIN_CATEGORY: LiveCategory = {
  id: 1,
  parent_id: null,
  name: 'Restaurants',
  slug: 'restaurants',
  is_active: true,
  icon: 'https://api.test/storage/categories/icons/a.jpg',
  icon_color: '#FF8104',
  translations: { name: { ar: 'مطاعم', en: 'Restaurants' } },
  parent: null,
  stores_count: 2,
  updated_at: '2026-10-10T17:41:31.000000Z',
};

export const LIVE_SUB_CATEGORY: LiveCategory = {
  ...LIVE_MAIN_CATEGORY,
  id: 17,
  parent_id: 1,
  name: 'Fast food',
  slug: 'fast-food',
  is_active: false,
  translations: { name: { ar: 'وجبات سريعة', en: 'Fast food' } },
  parent: { id: 1, name: 'Restaurants' },
  stores_count: 0,
};
