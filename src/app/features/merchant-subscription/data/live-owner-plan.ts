/** A plan as the /owner routes send it. */
export interface LiveOwnerPlan {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly currencyCode: string;
  /** monthly, yearly or custom. */
  readonly billingCycle: string;
  readonly maxAds: number | null;
  readonly maxOffers: number | null;
  readonly maxProducts: number | null;
  /** Pictures and videos together. */
  readonly maxImages: number | null;
  readonly features: readonly string[] | null;
}
