/** A delivery link of GET /owner/store; no row has been seen yet, so both spellings are read. */
export interface LiveOwnerDeliveryLink {
  readonly platformId?: string | number;
  readonly deliveryPlatformId?: string | number;
  readonly platform?: LiveOwnerLinkPlatform | null;
  readonly deliveryPlatform?: LiveOwnerLinkPlatform | null;
  readonly isEnabled?: boolean;
  readonly isActive?: boolean;
  readonly url?: string | null;
  readonly storeUrl?: string | null;
}

export interface LiveOwnerLinkPlatform {
  readonly id: string | number;
  readonly name: string;
  readonly logo?: string | null;
  readonly logoUrl?: string | null;
}
