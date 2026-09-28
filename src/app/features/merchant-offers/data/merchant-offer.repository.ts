import { Observable } from 'rxjs';
import { OfferDraftFields } from '../../../shared/models/offer-draft-fields';
import { OfferItem } from '../../../shared/models/offer-item';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferCatalog } from '../models/merchant-offer-catalog';

export abstract class MerchantOfferRepository {
  abstract getCatalog(): Observable<MerchantOfferCatalog>;
  abstract getOffer(id: string): Observable<MerchantOffer>;
  /** The products and services an offer can cover. */
  abstract getItems(): Observable<readonly OfferItem[]>;
  abstract createOffer(draft: OfferDraftFields): Observable<MerchantOffer>;
  abstract updateOffer(id: string, draft: OfferDraftFields): Observable<MerchantOffer>;
  abstract pauseOffer(id: string): Observable<MerchantOffer>;
  abstract resumeOffer(id: string): Observable<MerchantOffer>;
  abstract deleteOffer(id: string): Observable<void>;
}
