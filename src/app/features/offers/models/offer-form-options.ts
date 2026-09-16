import { OfferPlace } from './offer-place';

export interface OfferFormOptions {
  readonly places: readonly OfferPlace[];
  readonly categoryNames: readonly string[];
}
