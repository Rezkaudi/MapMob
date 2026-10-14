import { DeliveryPlatformStatus } from './delivery-platform-status';

/** One ordering app in the admin table, such as Talabat or BeeOrder. */
export interface DeliveryPlatformEntry {
  readonly id: string;
  /** The Arabic name, e.g. طلبات. */
  readonly name: string;
  readonly latinName: string;
  readonly logoUrl: string | null;
  /** Empty when the server does not keep one. */
  readonly websiteUrl: string;
  /** `null` when the server does not count them. */
  readonly linkedStoreCount: number | null;
  /** Times app users were sent from a place page to this app. */
  readonly referralCount: number | null;
  readonly status: DeliveryPlatformStatus;
  /** 1 is shown first in the lists of the app and the owner dashboard. */
  readonly sortOrder: number;
  readonly createdAt: string;
}
