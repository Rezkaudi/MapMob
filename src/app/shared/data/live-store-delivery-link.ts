import { LiveDeliveryPlatform } from './live-delivery-platform';

/** One row of `/admin/stores/{id}/delivery-links`. */
export interface LiveStoreDeliveryLink {
  readonly id: string;
  readonly storeId: string;
  readonly deliveryPlatformId: string;
  readonly deliveryPlatform: LiveDeliveryPlatform | null;
  readonly url: string;
  readonly isActive: boolean;
  readonly sortOrder: number | null;
  readonly createdAt: string;
}
