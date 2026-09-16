import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { CampaignSummary } from '../../../shared/models/campaign-summary';
import { Ad } from '../models/ad';
import { AdDetail } from '../models/ad-detail';
import { AdDraft } from '../models/ad-draft';
import { AdFormOptions } from '../models/ad-form-options';
import { AdQuery } from '../models/ad-query';

export abstract class AdRepository {
  abstract getAds(query: AdQuery): Observable<PagedResult<Ad>>;
  abstract getSummary(): Observable<CampaignSummary>;
  abstract getAdDetail(id: string): Observable<AdDetail>;
  abstract getFormOptions(): Observable<AdFormOptions>;
  abstract createAd(draft: AdDraft): Observable<Ad>;
  abstract updateAd(id: string, draft: AdDraft): Observable<Ad>;
  abstract deleteAd(id: string): Observable<void>;
  /** Every ad matching the filters, not just one page. */
  abstract exportAds(query: AdQuery): Observable<Blob>;
}
