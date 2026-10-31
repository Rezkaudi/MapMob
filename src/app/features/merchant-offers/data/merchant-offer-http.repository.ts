import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LiveOwnerQuotaSummary } from '../../../shared/data/live-owner-quota-summary';
import { ownerPlanOf } from '../../../shared/data/owner-plan-of';
import { readAllOwnerPages } from '../../../shared/data/read-all-owner-pages';
import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { OfferDraftFields } from '../../../shared/models/offer-draft-fields';
import { OfferItem } from '../../../shared/models/offer-item';
import { LiveOwnerProduct } from '../../merchant-products/data/live-owner-product';
import { toMerchantProduct } from '../../merchant-products/data/to-merchant-product';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferCatalog } from '../models/merchant-offer-catalog';
import { LiveOwnerOffer } from './live-owner-offer';
import { MerchantOfferRepository } from './merchant-offer.repository';
import { toOwnerOfferFormData, toOwnerOfferUpdateFormData } from './owner-offer-form-data';
import { toMerchantOffer } from './to-merchant-offer';

@Injectable()
export class MerchantOfferHttpRepository implements MerchantOfferRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly clock = inject(CLOCK);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly offersUrl = `${this.apiBaseUrl}/owner/offers`;

  getCatalog(): Observable<MerchantOfferCatalog> {
    return forkJoin({
      summary: this.httpClient
        .get<LiveEnvelope<LiveOwnerQuotaSummary>>(`${this.offersUrl}/summary`)
        .pipe(map(({ data }) => data)),
      offers: readAllOwnerPages<LiveOwnerOffer>(this.httpClient, this.offersUrl),
    }).pipe(
      map(({ summary, offers }) => {
        const today = this.today();
        return {
          plan: ownerPlanOf(summary),
          activeOfferLimit: summary.quota.limit,
          items: offers.map((offer) => toMerchantOffer(offer, today)),
        };
      }),
    );
  }

  getOffer(id: string): Observable<MerchantOffer> {
    return this.readOffer(
      this.httpClient.get<LiveEnvelope<LiveOwnerOffer>>(`${this.offersUrl}/${id}`),
    );
  }

  getItems(): Observable<readonly OfferItem[]> {
    return readAllOwnerPages<LiveOwnerProduct>(
      this.httpClient,
      `${this.apiBaseUrl}/owner/products`,
    ).pipe(
      map((products) =>
        products
          .map(toMerchantProduct)
          .map(({ id, name, price, currency }) => ({ id, name, price, currency })),
      ),
    );
  }

  createOffer(draft: OfferDraftFields): Observable<MerchantOffer> {
    return this.saveOffer(this.offersUrl, toOwnerOfferFormData(draft));
  }

  updateOffer(id: string, draft: OfferDraftFields): Observable<MerchantOffer> {
    return this.saveOffer(`${this.offersUrl}/${id}`, toOwnerOfferUpdateFormData(draft));
  }

  pauseOffer(id: string): Observable<MerchantOffer> {
    return this.saveOffer(`${this.offersUrl}/${id}/pause`, null);
  }

  resumeOffer(id: string): Observable<MerchantOffer> {
    return this.saveOffer(`${this.offersUrl}/${id}/resume`, null);
  }

  deleteOffer(id: string): Observable<void> {
    return this.httpClient.delete<unknown>(`${this.offersUrl}/${id}`).pipe(map(() => undefined));
  }

  private saveOffer(url: string, body: FormData | null): Observable<MerchantOffer> {
    return this.readOffer(this.httpClient.post<LiveEnvelope<LiveOwnerOffer>>(url, body));
  }

  private readOffer(request: Observable<LiveEnvelope<LiveOwnerOffer>>): Observable<MerchantOffer> {
    return request.pipe(map(({ data }) => toMerchantOffer(data, this.today())));
  }

  private today(): string {
    return toCalendarDay(this.clock());
  }
}
