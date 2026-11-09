/** The store list the offer form options carry; the payment routes have none. */
export interface LiveOfferStoreOptions {
  readonly stores: readonly { readonly id: number | string; readonly name: string }[];
}
