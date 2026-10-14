import { LiveDeliveryPlatform } from '../data/live-delivery-platform';

export function buildLiveDeliveryPlatform(
  overrides: Partial<LiveDeliveryPlatform> = {},
): LiveDeliveryPlatform {
  return {
    id: 1,
    name: 'tawseel',
    logo: 'https://api.test/storage/delivery-platforms/tawseel.jpg',
    is_active: true,
    sort_order: 1,
    created_at: '2026-10-14T18:45:56+00:00',
    ...overrides,
  };
}
