/** A product or service of a store that an offer can cover. */
export interface OfferItem {
  readonly id: string;
  readonly name: string;
  /** In Syrian pounds. */
  readonly price: number;
}
