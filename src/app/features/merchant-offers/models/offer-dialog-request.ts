import { MerchantOffer } from './merchant-offer';

/** What sits over the page: the detail drawer or the delete question. */
export type OfferDialogRequest =
  | { readonly kind: 'details'; readonly offerId: string }
  | { readonly kind: 'delete'; readonly offer: MerchantOffer };
