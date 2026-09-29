import { DeliveryPlatform } from './delivery-platform';

/** The place's page on one ordering app. A switched-off app keeps its link for later. */
export interface StoreDeliveryLink {
  readonly platform: DeliveryPlatform;
  readonly isEnabled: boolean;
  readonly storeUrl: string | null;
}
