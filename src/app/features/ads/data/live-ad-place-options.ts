/** The ad route has no store list, so the form reads the one the offer form options carry. */
export interface LiveAdPlaceOptions {
  readonly stores: readonly { readonly id: number | string; readonly name: string }[];
}
