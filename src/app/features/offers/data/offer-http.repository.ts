import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LivePage, toPagedResult } from '../../../core/http/live-page';
import { LiveReference } from '../../../core/http/live-reference';
import { PagedResult } from '../../../core/models/paged-result';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { CampaignSummary } from '../../../shared/models/campaign-summary';
import { OfferItem } from '../../../shared/models/offer-item';
import { Offer } from '../models/offer';
import { OfferDetail } from '../models/offer-detail';
import { OfferDraft } from '../models/offer-draft';
import { OfferFormOptions } from '../models/offer-form-options';
import { OfferQuery } from '../models/offer-query';
import { LiveOffer } from './live-offer';
import { LiveOfferFormOptions } from './live-offer-form-options';
import {
  toCampaignSummary,
  toOffer,
  toOfferDetail,
  toOfferFormOptions,
} from './live-offer-mapping';
import { LiveOfferSummary } from './live-offer-summary';
import { toOfferFormData } from './offer-form-data';
import { toOfferFilterParams, toOfferQueryParams } from './offer-query-params';
import { OfferRepository } from './offer.repository';

type LiveStoreCategories = LiveEnvelope<{ readonly mainCategories: readonly LiveReference[] }>;

@Injectable()
export class OfferHttpRepository implements OfferRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly clock = inject(CLOCK);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly offersUrl = `${this.adminUrl}/offers`;
  private readonly storesUrl = `${this.adminUrl}/stores`;

  getOffers(query: OfferQuery): Observable<PagedResult<Offer>> {
    const today = this.today();
    return this.httpClient
      .get<LivePage<LiveOffer>>(this.offersUrl, { params: toOfferQueryParams(query, today) })
      .pipe(map((page) => toPagedResult(page, (offer) => toOffer(offer, today))));
  }

  getSummary(): Observable<CampaignSummary> {
    return this.httpClient
      .get<LiveEnvelope<LiveOfferSummary>>(`${this.offersUrl}/summary`)
      .pipe(map(({ data }) => toCampaignSummary(data)));
  }

  getOfferDetail(id: string): Observable<OfferDetail> {
    return this.httpClient
      .get<LiveEnvelope<LiveOffer>>(`${this.offersUrl}/${id}`)
      .pipe(map(({ data }) => toOfferDetail(data, this.today())));
  }

  pauseOffer(id: string): Observable<Offer> {
    return this.saveOffer(`${this.offersUrl}/${id}/pause`, null);
  }

  resumeOffer(id: string): Observable<Offer> {
    return this.saveOffer(`${this.offersUrl}/${id}/resume`, null);
  }

  // The offer route lists the stores only; the category names come from the store form.
  getFormOptions(): Observable<OfferFormOptions> {
    return forkJoin({
      offerOptions: this.httpClient.get<LiveEnvelope<LiveOfferFormOptions>>(
        `${this.offersUrl}/formoptions`,
      ),
      storeOptions: this.httpClient.get<LiveStoreCategories>(`${this.storesUrl}/formoptions`),
    }).pipe(
      map(({ offerOptions, storeOptions }) =>
        toOfferFormOptions(offerOptions.data, storeOptions.data.mainCategories),
      ),
    );
  }

  getPlaceItems(placeId: string): Observable<readonly OfferItem[]> {
    return this.httpClient
      .get<LiveEnvelope<readonly OfferItem[]>>(`${this.storesUrl}/${placeId}/offer-items`)
      .pipe(map(({ data }) => data));
  }

  createOffer(draft: OfferDraft): Observable<Offer> {
    return this.saveOffer(this.offersUrl, toOfferFormData(draft));
  }

  // PHP reads form data on POST only, so the update names its real method in the body.
  updateOffer(id: string, draft: OfferDraft): Observable<Offer> {
    const body = toOfferFormData(draft);
    body.set('_method', 'PUT');
    return this.saveOffer(`${this.offersUrl}/${id}`, body);
  }

  deleteOffer(id: string): Observable<void> {
    return this.httpClient.delete(`${this.offersUrl}/${id}`).pipe(map(() => undefined));
  }

  exportOffers(query: OfferQuery): Observable<Blob> {
    return this.httpClient.get(`${this.offersUrl}/export`, {
      params: toOfferFilterParams(query, this.today()),
      responseType: 'blob',
    });
  }

  private saveOffer(url: string, body: FormData | null): Observable<Offer> {
    return this.httpClient
      .post<LiveEnvelope<LiveOffer>>(url, body)
      .pipe(map(({ data }) => toOffer(data, this.today())));
  }

  private today(): string {
    return toCalendarDay(this.clock());
  }
}
