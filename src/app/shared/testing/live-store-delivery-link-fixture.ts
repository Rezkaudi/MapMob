import { LiveStoreDeliveryLink } from '../data/live-store-delivery-link';
import { buildLiveDeliveryPlatform } from './live-delivery-platform-fixture';

export function buildLiveStoreDeliveryLink(
  overrides: Partial<LiveStoreDeliveryLink> = {},
): LiveStoreDeliveryLink {
  return {
    id: '1',
    storeId: '1',
    deliveryPlatformId: '1',
    deliveryPlatform: buildLiveDeliveryPlatform(),
    url: 'https://tawseel.com/store/1',
    isActive: true,
    sortOrder: 1,
    createdAt: '2026-10-14T19:01:49+00:00',
    ...overrides,
  };
}
