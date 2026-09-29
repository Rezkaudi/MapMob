import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { LinkedStore } from '../models/linked-store';

/** The database counts the links itself, so the seed leaves the count out. */
export type SeedPlatform = Omit<DeliveryPlatformEntry, 'linkedStoreCount'>;

export interface DeliveryPlatformMockSeed {
  readonly platforms: readonly SeedPlatform[];
  readonly linkedStores: Readonly<Record<string, readonly LinkedStore[]>>;
}

type StoreTemplate = Omit<LinkedStore, 'storeUrl' | 'linkedAt'> & { readonly slug: string };

const RESTAURANTS = { id: 'category-1', name: 'مطاعم' };
const CAFES = { id: 'category-2', name: 'مقاهي' };
const SWEETS = { id: 'category-3', name: 'حلويات' };
const PHARMACIES = { id: 'category-4', name: 'صيدليات' };
const DAMASCUS = { id: 'governorate-1', name: 'دمشق' };
const TARTUS = { id: 'governorate-2', name: 'طرطوس' };
const LATAKIA = { id: 'governorate-3', name: 'اللاذقية' };
const HOMS = { id: 'governorate-4', name: 'حمص' };

const STORES: readonly StoreTemplate[] = [
  {
    id: 'place-11',
    slug: 'city-restaurant',
    name: 'مطعم المدينة',
    logoUrl: null,
    category: RESTAURANTS,
    governorate: TARTUS,
    area: { id: 'area-21', name: 'الدريكيش' },
  },
  {
    id: 'place-4',
    slug: 'al-asala',
    name: 'مطعم الأصالة',
    logoUrl: null,
    category: RESTAURANTS,
    governorate: DAMASCUS,
    area: { id: 'area-1', name: 'المزة' },
  },
  {
    id: 'place-5',
    slug: 'corner-cafe',
    name: 'مقهى الزاوية',
    logoUrl: null,
    category: CAFES,
    governorate: LATAKIA,
    area: { id: 'area-31', name: 'الزراعة' },
  },
  {
    id: 'place-12',
    slug: 'sham-sweets',
    name: 'حلويات الشام',
    logoUrl: null,
    category: SWEETS,
    governorate: DAMASCUS,
    area: { id: 'area-2', name: 'الميدان' },
  },
  {
    id: 'place-3',
    slug: 'al-hayat',
    name: 'صيدلية الحياة',
    logoUrl: null,
    category: PHARMACIES,
    governorate: TARTUS,
    area: { id: 'area-22', name: 'بانياس' },
  },
  {
    id: 'place-13',
    slug: 'rif-chicken',
    name: 'فروج الريف',
    logoUrl: null,
    category: RESTAURANTS,
    governorate: HOMS,
    area: { id: 'area-41', name: 'الوعر' },
  },
  {
    id: 'place-14',
    slug: 'roma-pizza',
    name: 'بيتزا روما',
    logoUrl: null,
    category: RESTAURANTS,
    governorate: LATAKIA,
    area: null,
  },
];

function linkStores(
  websiteUrl: string,
  storeIds: readonly string[],
  linkedAt: string,
): readonly LinkedStore[] {
  return STORES.filter((store) => storeIds.includes(store.id)).map(({ slug, ...store }) => ({
    ...store,
    storeUrl: `${websiteUrl}/${slug}`,
    linkedAt,
  }));
}

/** Ids 1–3 match the ordering apps of the owner's store page. */
export const DELIVERY_PLATFORM_MOCK_SEED: DeliveryPlatformMockSeed = {
  platforms: [
    {
      id: '1',
      name: 'بي أوردر',
      latinName: 'BeeOrder',
      logoUrl: null,
      websiteUrl: 'https://www.beeorder.com',
      referralCount: 1200,
      status: 'active',
      sortOrder: 1,
      createdAt: '2024-01-26T09:00:00.000Z',
    },
    {
      id: '2',
      name: 'يلا غو',
      latinName: 'yallago',
      logoUrl: null,
      websiteUrl: 'https://www.yallago.sy',
      referralCount: 860,
      status: 'active',
      sortOrder: 2,
      createdAt: '2024-02-14T09:00:00.000Z',
    },
    {
      id: '3',
      name: 'طلبات',
      latinName: 'talabat',
      logoUrl: null,
      websiteUrl: 'https://www.talabat.com',
      referralCount: 1640,
      status: 'active',
      sortOrder: 3,
      createdAt: '2024-03-03T09:00:00.000Z',
    },
    {
      id: '4',
      name: 'كريم',
      latinName: 'Careem',
      logoUrl: null,
      websiteUrl: 'https://www.careem.com',
      referralCount: 410,
      status: 'active',
      sortOrder: 4,
      createdAt: '2024-06-20T09:00:00.000Z',
    },
    {
      id: '5',
      name: 'وصّل',
      latinName: 'Wassel',
      logoUrl: null,
      websiteUrl: 'https://www.wassel.sy',
      referralCount: 275,
      status: 'active',
      sortOrder: 5,
      createdAt: '2025-01-09T09:00:00.000Z',
    },
    {
      id: '6',
      name: 'فودي',
      latinName: 'Foody',
      logoUrl: null,
      websiteUrl: 'https://www.foody.sy',
      referralCount: 130,
      status: 'active',
      sortOrder: 6,
      createdAt: '2025-04-17T09:00:00.000Z',
    },
    {
      id: '7',
      name: 'فود زون',
      latinName: 'FoodZone',
      logoUrl: null,
      websiteUrl: 'https://www.foodzone.sy',
      referralCount: 45,
      status: 'suspended',
      sortOrder: 7,
      createdAt: '2025-08-02T09:00:00.000Z',
    },
  ],
  linkedStores: {
    '1': linkStores(
      'https://www.beeorder.com',
      ['place-11', 'place-4', 'place-5', 'place-12', 'place-13'],
      '2024-02-01T09:00:00.000Z',
    ),
    '2': linkStores(
      'https://www.yallago.sy',
      ['place-4', 'place-3', 'place-14'],
      '2024-03-10T09:00:00.000Z',
    ),
    '3': linkStores(
      'https://www.talabat.com',
      ['place-11', 'place-4', 'place-5', 'place-12', 'place-3', 'place-13'],
      '2024-04-12T09:00:00.000Z',
    ),
    '4': linkStores('https://www.careem.com', ['place-12', 'place-14'], '2024-07-01T09:00:00.000Z'),
    '5': linkStores('https://www.wassel.sy', ['place-13'], '2025-02-11T09:00:00.000Z'),
    '6': [],
    '7': linkStores('https://www.foodzone.sy', ['place-5'], '2025-08-15T09:00:00.000Z'),
  },
};
