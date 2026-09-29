import { PlatformBrand } from './platform-brand';

/** The four cards above the table. */
export interface DeliveryPlatformSummary {
  readonly referralCount: number;
  /** `null` until any app user has been sent to a platform. */
  readonly mostUsedPlatform: PlatformBrand | null;
  /** Places with at least one switched-on link. */
  readonly linkedStoreCount: number;
  readonly activeCount: number;
  /** Every platform, on or off; the add dialog suggests the next display position from it. */
  readonly platformCount: number;
}
