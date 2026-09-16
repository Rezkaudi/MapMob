import { Offer } from './offer';
import { OfferPlace } from './offer-place';
import { OfferScope } from './offer-scope';

export interface OfferDetail {
  readonly offer: Offer;
  readonly description: string;
  readonly place: OfferPlace;
  readonly discountPercent: number;
  readonly scope: OfferScope;
  readonly itemIds: readonly string[];
  readonly imageUrl: string | null;
}
