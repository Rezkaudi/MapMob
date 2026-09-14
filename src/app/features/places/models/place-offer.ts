export interface PlaceOffer {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly dateRange: string;
  readonly imageUrl: string;
  /** Drives the green "نشط" tag the design puts over the picture. */
  readonly isActive: boolean;
}
