/** What the add-product dialog collects before an id is assigned. */
export interface ProductDraft {
  readonly name: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly orderUrl: string;
}
