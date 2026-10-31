import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LiveOwnerQuotaSummary } from '../../../shared/data/live-owner-quota-summary';
import { ownerPlanOf } from '../../../shared/data/owner-plan-of';
import { readAllOwnerPages } from '../../../shared/data/read-all-owner-pages';
import { ProductDraft } from '../../../shared/models/product-draft';
import { MerchantProduct } from '../models/merchant-product';
import { MerchantProductCatalog } from '../models/merchant-product-catalog';
import { LiveOwnerProduct } from './live-owner-product';
import { toNewProductFormData, toProductUpdateFormData } from './merchant-product-form-data';
import { MerchantProductRepository } from './merchant-product.repository';
import { toMerchantProduct } from './to-merchant-product';

@Injectable()
export class MerchantProductHttpRepository implements MerchantProductRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly productsUrl = `${inject(API_BASE_URL)}/owner/products`;

  getCatalog(): Observable<MerchantProductCatalog> {
    return forkJoin({
      summary: this.httpClient
        .get<LiveEnvelope<LiveOwnerQuotaSummary>>(`${this.productsUrl}/summary`)
        .pipe(map(({ data }) => data)),
      products: readAllOwnerPages<LiveOwnerProduct>(this.httpClient, this.productsUrl),
    }).pipe(
      map(({ summary, products }) => ({
        plan: ownerPlanOf(summary),
        productLimit: summary.quota.limit,
        items: products.map(toMerchantProduct),
      })),
    );
  }

  createProduct(draft: ProductDraft): Observable<MerchantProduct> {
    return this.httpClient
      .post<LiveEnvelope<LiveOwnerProduct>>(this.productsUrl, toNewProductFormData(draft))
      .pipe(map(({ data }) => toMerchantProduct(data)));
  }

  updateProduct(id: string, draft: ProductDraft): Observable<MerchantProduct> {
    return this.httpClient
      .post<LiveEnvelope<LiveOwnerProduct>>(
        `${this.productsUrl}/${id}`,
        toProductUpdateFormData(draft),
      )
      .pipe(map(({ data }) => toMerchantProduct(data)));
  }

  deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<unknown>(`${this.productsUrl}/${id}`).pipe(map(() => undefined));
  }
}
