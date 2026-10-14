import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import {
  LivePaginationPage,
  toPagedResultFromPagination,
} from '../../../core/http/live-pagination-page';
import { PagedResult } from '../../../core/models/paged-result';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { CampaignSummary } from '../../../shared/models/campaign-summary';
import { Ad } from '../models/ad';
import { AdDetail } from '../models/ad-detail';
import { AdDraft } from '../models/ad-draft';
import { AdFormOptions } from '../models/ad-form-options';
import { AdQuery } from '../models/ad-query';
import { toAdFormData } from './ad-form-data';
import { toAdFilterParams, toAdQueryParams } from './ad-query-params';
import { AdRepository } from './ad.repository';
import { LiveAd } from './live-ad';
import { toAd, toAdDetail, toAdSummary } from './live-ad-mapping';
import { LiveAdPlaceOptions } from './live-ad-place-options';
import { LiveAdSummary } from './live-ad-summary';

@Injectable()
export class AdHttpRepository implements AdRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly clock = inject(CLOCK);
  private readonly adminUrl = `${inject(API_BASE_URL)}/admin`;
  private readonly adsUrl = `${this.adminUrl}/ads`;

  getAds(query: AdQuery): Observable<PagedResult<Ad>> {
    const today = this.today();
    return this.httpClient
      .get<LivePaginationPage<LiveAd>>(this.adsUrl, { params: toAdQueryParams(query) })
      .pipe(map((page) => toPagedResultFromPagination(page, (ad) => toAd(ad, today))));
  }

  getSummary(): Observable<CampaignSummary> {
    return this.httpClient
      .get<LiveEnvelope<LiveAdSummary>>(`${this.adsUrl}/summary`)
      .pipe(map(({ data }) => toAdSummary(data)));
  }

  getAdDetail(id: string): Observable<AdDetail> {
    return this.httpClient
      .get<LiveEnvelope<LiveAd>>(`${this.adsUrl}/${id}`)
      .pipe(map(({ data }) => toAdDetail(data, this.today())));
  }

  pauseAd(id: string): Observable<Ad> {
    return this.saveAd(`${this.adsUrl}/${id}/pause`, null);
  }

  resumeAd(id: string): Observable<Ad> {
    return this.saveAd(`${this.adsUrl}/${id}/resume`, null);
  }

  getFormOptions(): Observable<AdFormOptions> {
    return this.httpClient
      .get<LiveEnvelope<LiveAdPlaceOptions>>(`${this.adminUrl}/offers/formoptions`)
      .pipe(
        map(({ data }) => ({
          places: data.stores.map((store) => ({ id: String(store.id), name: store.name })),
        })),
      );
  }

  createAd(draft: AdDraft): Observable<Ad> {
    return this.saveAd(this.adsUrl, toAdFormData(draft));
  }

  // PHP reads form data on POST only, so the update names its real method in the body.
  updateAd(id: string, draft: AdDraft): Observable<Ad> {
    const body = toAdFormData(draft);
    body.set('_method', 'PUT');
    return this.saveAd(`${this.adsUrl}/${id}`, body);
  }

  deleteAd(id: string): Observable<void> {
    return this.httpClient.delete(`${this.adsUrl}/${id}`).pipe(map(() => undefined));
  }

  exportAds(query: AdQuery): Observable<Blob> {
    return this.httpClient.get(`${this.adsUrl}/export`, {
      params: toAdFilterParams(query),
      responseType: 'blob',
    });
  }

  private saveAd(url: string, body: FormData | null): Observable<Ad> {
    return this.httpClient
      .post<LiveEnvelope<LiveAd>>(url, body)
      .pipe(map(({ data }) => toAd(data, this.today())));
  }

  private today(): string {
    return toCalendarDay(this.clock());
  }
}
