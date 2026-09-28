import { Injectable, inject } from '@angular/core';
import { Observable, from, map, shareReplay, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { CLOCK } from '../../../core/config/clock';
import { ProductDraft } from '../../../shared/models/product-draft';
import { MerchantProduct } from '../models/merchant-product';
import { MerchantProductCatalog } from '../models/merchant-product-catalog';
import type { MerchantProductMockDatabase } from './merchant-product-mock-database';
import { MerchantProductRepository } from './merchant-product.repository';

@Injectable()
export class MerchantProductMockRepository implements MerchantProductRepository {
  private readonly clock = inject(CLOCK);
  // Loaded on first use, so the seed and its copy stay out of the initial bundle.
  private readonly database$ = from(import('./merchant-product-mock-database')).pipe(
    map((module) => new module.MerchantProductMockDatabase(this.clock)),
    shareReplay(1),
  );

  getCatalog(): Observable<MerchantProductCatalog> {
    return this.run((database) => database.readCatalog());
  }

  createProduct(draft: ProductDraft): Observable<MerchantProduct> {
    return this.run((database) => database.create(draft));
  }

  updateProduct(id: string, draft: ProductDraft): Observable<MerchantProduct> {
    return this.run((database) => database.update(id, draft));
  }

  deleteProduct(id: string): Observable<void> {
    return this.run((database) => database.remove(id));
  }

  private run<T>(work: (database: MerchantProductMockDatabase) => T): Observable<T> {
    return this.database$.pipe(switchMap((database) => mockRequest(() => work(database))));
  }
}
