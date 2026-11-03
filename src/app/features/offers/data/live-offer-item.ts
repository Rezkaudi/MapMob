/** GET /admin/stores/{id}/offer-items: the currency is whatever text the product was saved with. */
export interface LiveOfferItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly currency: string | null;
}
