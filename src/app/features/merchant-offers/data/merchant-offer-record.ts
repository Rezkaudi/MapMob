import { MerchantOffer } from '../models/merchant-offer';

/** How the mock keeps an offer: the two flags the server stores, not the status it works out. */
export interface MerchantOfferRecord extends Omit<MerchantOffer, 'status'> {
  readonly isPaused: boolean;
  readonly isDraft: boolean;
}
