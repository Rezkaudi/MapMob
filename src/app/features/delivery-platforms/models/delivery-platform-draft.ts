import { DeliveryPlatformStatus } from './delivery-platform-status';

export interface DeliveryPlatformDraft {
  readonly name: string;
  readonly latinName: string;
  readonly websiteUrl: string;
  readonly status: DeliveryPlatformStatus;
  readonly sortOrder: number;
  /** A newly picked logo; `null` keeps the saved one. */
  readonly logoFile: File | null;
  /** `null` with no new file removes the saved logo. */
  readonly logoUrl: string | null;
}
