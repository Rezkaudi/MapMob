export interface PlaceProduct {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  /** Currency shown next to the price, e.g. `ل.س`. */
  readonly currency: string;
  readonly imageUrl: string;
  readonly isAvailable: boolean;
  /** Sends the visitor to an external ordering platform. Empty when there is none. */
  readonly orderUrl: string;
}
