import { DeliveryPlatformDraft } from '../models/delivery-platform-draft';
import { DeliveryPlatformEntry } from '../models/delivery-platform-entry';
import { DeliveryPlatformSummary } from '../models/delivery-platform-summary';
import { LinkedStore } from '../models/linked-store';

export function buildDeliveryPlatform(
  overrides: Partial<DeliveryPlatformEntry> = {},
): DeliveryPlatformEntry {
  return {
    id: 'platform-1',
    name: 'طلبات',
    latinName: 'talabat',
    logoUrl: null,
    websiteUrl: 'https://www.talabat.com',
    linkedStoreCount: 124,
    referralCount: 1200,
    status: 'active',
    sortOrder: 1,
    createdAt: '2024-01-26T09:00:00.000Z',
    ...overrides,
  };
}

export function buildDeliveryPlatformDraft(
  overrides: Partial<DeliveryPlatformDraft> = {},
): DeliveryPlatformDraft {
  return {
    name: 'طلبات',
    latinName: 'talabat',
    websiteUrl: 'https://www.talabat.com',
    status: 'active',
    sortOrder: 5,
    logoFile: null,
    logoUrl: null,
    ...overrides,
  };
}

export function buildDeliveryPlatformSummary(
  overrides: Partial<DeliveryPlatformSummary> = {},
): DeliveryPlatformSummary {
  return {
    referralCount: 400,
    mostUsedPlatform: { id: 'platform-1', name: 'طلبات', latinName: 'talabat' },
    linkedStoreCount: 300,
    activeCount: 6,
    platformCount: 7,
    ...overrides,
  };
}

export function buildLinkedStore(overrides: Partial<LinkedStore> = {}): LinkedStore {
  return {
    id: 'place-1',
    name: 'مطعم المدينة',
    logoUrl: null,
    category: { id: 'category-1', name: 'مطاعم' },
    governorate: { id: 'governorate-1', name: 'طرطوس' },
    area: { id: 'area-1', name: 'الدريكيش' },
    storeUrl: 'https://www.talabat.com/city-restaurant',
    linkedAt: '2024-01-26T09:00:00.000Z',
    ...overrides,
  };
}
