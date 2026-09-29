import { DeliveryPlatform } from '../../../shared/models/delivery-platform';

/** One platform of the ordering card, ready to show. */
export interface DeliveryLinkRow {
  readonly index: number;
  readonly platform: DeliveryPlatform;
  readonly isEnabled: boolean;
  readonly storeUrl: string;
  /** A switched-on platform with a valid link can be opened and copied. */
  readonly canOpen: boolean;
  readonly error: string | null;
}
