import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PagedResult } from '../../../core/models/paged-result';
import { Offer } from '../models/offer';
import { OfferDetail } from '../models/offer-detail';
import { OfferDraft } from '../models/offer-draft';
import { OfferFormOptions } from '../models/offer-form-options';
import { OfferItem } from '../models/offer-item';
import { OfferQuery } from '../models/offer-query';
import { CampaignSummary } from '../../../shared/models/campaign-summary';
import { toOfferFormData } from './offer-form-data';
import { toOfferQueryParams } from './offer-query-params';
import { OfferRepository } from './offer.repository';

@Injectable()
export class OfferHttpRepository implements OfferRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly offersUrl = `${this.apiBaseUrl}/offers`;

  getOffers(query: OfferQuery): Observable<PagedResult<Offer>> {
    return this.httpClient.get<PagedResult<Offer>>(this.offersUrl, {
      params: toOfferQueryParams(query),
    });
  }

  getSummary(): Observable<CampaignSummary> {
    return this.httpClient.get<CampaignSummary>(`${this.offersUrl}/summary`);
  }

  getOfferDetail(id: string): Observable<OfferDetail> {
    return this.httpClient.get<OfferDetail>(`${this.offersUrl}/${id}`);
  }

  pauseOffer(id: string): Observable<Offer> {
    return this.httpClient.post<Offer>(`${this.offersUrl}/${id}/pause`, null);
  }

  resumeOffer(id: string): Observable<Offer> {
    return this.httpClient.post<Offer>(`${this.offersUrl}/${id}/resume`, null);
  }

  getFormOptions(): Observable<OfferFormOptions> {
    return this.httpClient.get<OfferFormOptions>(`${this.offersUrl}/form-options`);
  }

  getPlaceItems(placeId: string): Observable<readonly OfferItem[]> {
    return this.httpClient.get<readonly OfferItem[]>(
      `${this.apiBaseUrl}/places/${placeId}/offer-items`,
    );
  }

  createOffer(draft: OfferDraft): Observable<Offer> {
    return this.httpClient.post<Offer>(this.offersUrl, toOfferFormData(draft));
  }

  updateOffer(id: string, draft: OfferDraft): Observable<Offer> {
    return this.httpClient.put<Offer>(`${this.offersUrl}/${id}`, toOfferFormData(draft));
  }

  deleteOffer(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.offersUrl}/${id}`);
  }

  exportOffers(query: OfferQuery): Observable<Blob> {
    return this.httpClient.get(`${this.offersUrl}/export`, {
      params: toOfferQueryParams(query),
      responseType: 'blob',
    });
  }
}
