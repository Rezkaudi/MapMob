import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { ProductDraft } from '../../../shared/models/product-draft';
import { MerchantProduct } from '../models/merchant-product';
import { MerchantProductCatalog } from '../models/merchant-product-catalog';
import { toNewProductFormData, toProductUpdateFormData } from './merchant-product-form-data';
import { MerchantProductRepository } from './merchant-product.repository';

@Injectable()
export class MerchantProductHttpRepository implements MerchantProductRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly productsUrl = `${inject(API_BASE_URL)}/owner/products`;

  getCatalog(): Observable<MerchantProductCatalog> {
    return this.httpClient.get<MerchantProductCatalog>(this.productsUrl);
  }

  createProduct(draft: ProductDraft): Observable<MerchantProduct> {
    return this.httpClient.post<MerchantProduct>(this.productsUrl, toNewProductFormData(draft));
  }

  updateProduct(id: string, draft: ProductDraft): Observable<MerchantProduct> {
    return this.httpClient.put<MerchantProduct>(
      `${this.productsUrl}/${id}`,
      toProductUpdateFormData(draft),
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.productsUrl}/${id}`);
  }
}
