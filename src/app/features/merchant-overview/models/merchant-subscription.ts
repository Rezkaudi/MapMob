export interface MerchantSubscription {
  readonly plan: { readonly id: string; readonly name: string };
  /** yyyy-mm-dd */
  readonly startsOn: string;
  /** yyyy-mm-dd */
  readonly endsOn: string;
  readonly features: readonly string[];
}
