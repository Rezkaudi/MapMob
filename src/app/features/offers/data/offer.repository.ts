import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Offer } from '../models/offer';
import { OfferDetail } from '../models/offer-detail';
import { OfferDraft } from '../models/offer-draft';
import { OfferFormOptions } from '../models/offer-form-options';
import { OfferItem } from '../models/offer-item';
import { OfferQuery } from '../models/offer-query';
import { CampaignSummary } from '../../../shared/models/campaign-summary';

export abstract class OfferRepository {
  abstract getOffers(query: OfferQuery): Observable<PagedResult<Offer>>;
  abstract getSummary(): Observable<CampaignSummary>;
  abstract getOfferDetail(id: string): Observable<OfferDetail>;
  abstract pauseOffer(id: string): Observable<Offer>;
  /** The server puts the offer back to scheduled, active or expired, by its days. */
  abstract resumeOffer(id: string): Observable<Offer>;
  abstract getFormOptions(): Observable<OfferFormOptions>;
  abstract getPlaceItems(placeId: string): Observable<readonly OfferItem[]>;
  abstract createOffer(draft: OfferDraft): Observable<Offer>;
  abstract updateOffer(id: string, draft: OfferDraft): Observable<Offer>;
  abstract deleteOffer(id: string): Observable<void>;
  /** Every offer matching the filters, not just one page. */
  abstract exportOffers(query: OfferQuery): Observable<Blob>;
}
