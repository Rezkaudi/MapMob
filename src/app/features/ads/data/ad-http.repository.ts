import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { CampaignSummary } from '../../../shared/models/campaign-summary';
import { Ad } from '../models/ad';
import { AdDetail } from '../models/ad-detail';
import { AdDraft } from '../models/ad-draft';
import { AdFormOptions } from '../models/ad-form-options';
import { AdQuery } from '../models/ad-query';
import { toAdFormData } from './ad-form-data';
import { toAdQueryParams } from './ad-query-params';
import { AdRepository } from './ad.repository';

@Injectable()
export class AdHttpRepository implements AdRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly adsUrl = `${inject(API_BASE_URL)}/ads`;

  getAds(query: AdQuery): Observable<PagedResult<Ad>> {
    return this.httpClient.get<PagedResult<Ad>>(this.adsUrl, { params: toAdQueryParams(query) });
  }

  getSummary(): Observable<CampaignSummary> {
    return this.httpClient.get<CampaignSummary>(`${this.adsUrl}/summary`);
  }

  getAdDetail(id: string): Observable<AdDetail> {
    return this.httpClient.get<AdDetail>(`${this.adsUrl}/${id}`);
  }

  getFormOptions(): Observable<AdFormOptions> {
    return this.httpClient.get<AdFormOptions>(`${this.adsUrl}/form-options`);
  }

  createAd(draft: AdDraft): Observable<Ad> {
    return this.httpClient.post<Ad>(this.adsUrl, toAdFormData(draft));
  }

  updateAd(id: string, draft: AdDraft): Observable<Ad> {
    return this.httpClient.put<Ad>(`${this.adsUrl}/${id}`, toAdFormData(draft));
  }

  deleteAd(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.adsUrl}/${id}`);
  }

  exportAds(query: AdQuery): Observable<Blob> {
    return this.httpClient.get(`${this.adsUrl}/export`, {
      params: toAdQueryParams(query),
      responseType: 'blob',
    });
  }
}
