import type { DeliveryPlatformEntry } from '../../../delivery-platforms/models/delivery-platform-entry';
import type { DeliveryPlatformPage } from '../../../delivery-platforms/models/delivery-platform-page';
import type { DeliveryPlatformSummary } from '../../../delivery-platforms/models/delivery-platform-summary';
import type { LinkedStore } from '../../../delivery-platforms/models/linked-store';

export const DELIVERY_PLATFORM_ROW = {
  id: '3',
  name: 'طلبات',
  latinName: 'talabat',
  logoUrl: 'https://cdn.mapmob.app/delivery-platforms/talabat.png',
  websiteUrl: 'https://www.talabat.com',
  linkedStoreCount: 124,
  referralCount: 1200,
  status: 'active',
  sortOrder: 3,
  createdAt: '2024-01-26T09:00:00Z',
} satisfies DeliveryPlatformEntry;

export const DELIVERY_PLATFORM_PAGE = {
  items: [
    DELIVERY_PLATFORM_ROW,
    {
      ...DELIVERY_PLATFORM_ROW,
      id: '1',
      name: 'بي أوردر',
      latinName: 'BeeOrder',
      logoUrl: null,
      websiteUrl: 'https://www.beeorder.com',
      linkedStoreCount: 98,
      referralCount: 860,
      sortOrder: 1,
      createdAt: '2024-02-14T09:00:00Z',
    },
  ],
  totalCount: 7,
} satisfies DeliveryPlatformPage;

export const DELIVERY_PLATFORM_SUMMARY = {
  referralCount: 4560,
  mostUsedPlatform: { id: '3', name: 'طلبات', latinName: 'talabat' },
  linkedStoreCount: 300,
  activeCount: 6,
  platformCount: 7,
} satisfies DeliveryPlatformSummary;

export const DELIVERY_PLATFORM_FORM = {
  name: 'طلبات',
  latinName: 'talabat',
  websiteUrl: 'https://www.talabat.com',
  status: 'active',
  sortOrder: 8,
  logo: '@talabat.png',
};

/** An edit that removes the saved logo sends removeLogo instead of a file. */
export const DELIVERY_PLATFORM_UPDATE_FORM = {
  name: 'طلبات',
  latinName: 'talabat',
  websiteUrl: 'https://www.talabat.com',
  status: 'active',
  sortOrder: 3,
  removeLogo: true,
};

export const LINKED_STORES = [
  {
    id: '12',
    name: 'مطعم المدينة',
    logoUrl: 'https://cdn.mapmob.app/places/12/logo.jpg',
    category: { id: '1', name: 'مطاعم' },
    governorate: { id: '5', name: 'طرطوس' },
    area: { id: '41', name: 'الدريكيش' },
    storeUrl: 'https://www.talabat.com/sy/city-restaurant',
    linkedAt: '2024-01-26T09:00:00Z',
  },
  {
    id: '15',
    name: 'بيتزا روما',
    logoUrl: null,
    category: { id: '1', name: 'مطاعم' },
    governorate: { id: '3', name: 'اللاذقية' },
    area: null,
    storeUrl: 'https://www.talabat.com/sy/roma-pizza',
    linkedAt: '2024-03-10T12:30:00Z',
  },
] satisfies LinkedStore[];
