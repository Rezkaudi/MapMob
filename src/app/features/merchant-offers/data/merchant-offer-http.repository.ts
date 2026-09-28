import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { toOfferDraftFormData } from '../../../shared/forms/offer-draft-form-data';
import { OfferDraftFields } from '../../../shared/models/offer-draft-fields';
import { OfferItem } from '../../../shared/models/offer-item';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferCatalog } from '../models/merchant-offer-catalog';
import { MerchantOfferRepository } from './merchant-offer.repository';

/** Only the fields the item picker reads from GET /owner/products. */
interface OwnerProductList {
  readonly items: readonly OfferItem[];
}

@Injectable()
export class MerchantOfferHttpRepository implements MerchantOfferRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly offersUrl = `${this.apiBaseUrl}/owner/offers`;

  getCatalog(): Observable<MerchantOfferCatalog> {
    return this.httpClient.get<MerchantOfferCatalog>(this.offersUrl);
  }

  getOffer(id: string): Observable<MerchantOffer> {
    return this.httpClient.get<MerchantOffer>(`${this.offersUrl}/${id}`);
  }

  getItems(): Observable<readonly OfferItem[]> {
    return this.httpClient
      .get<OwnerProductList>(`${this.apiBaseUrl}/owner/products`)
      .pipe(
        map(({ items }) =>
          items.map(({ id, name, price, currency }) => ({ id, name, price, currency })),
        ),
      );
  }

  createOffer(draft: OfferDraftFields): Observable<MerchantOffer> {
    return this.httpClient.post<MerchantOffer>(this.offersUrl, toOfferDraftFormData(draft));
  }

  updateOffer(id: string, draft: OfferDraftFields): Observable<MerchantOffer> {
    return this.httpClient.put<MerchantOffer>(
      `${this.offersUrl}/${id}`,
      toOfferDraftFormData(draft),
    );
  }

  pauseOffer(id: string): Observable<MerchantOffer> {
    return this.httpClient.post<MerchantOffer>(`${this.offersUrl}/${id}/pause`, null);
  }

  resumeOffer(id: string): Observable<MerchantOffer> {
    return this.httpClient.post<MerchantOffer>(`${this.offersUrl}/${id}/resume`, null);
  }

  deleteOffer(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.offersUrl}/${id}`);
  }
}
