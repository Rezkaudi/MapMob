export interface PlaceOffer {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly description: string;
  /** Shown as a tag over the picture, e.g. `20%`. Empty when the offer has no discount. */
  readonly discountLabel: string;
  readonly dateRange: string;
  readonly imageUrl: string;
}
