import { Observable } from 'rxjs';
import { ProductDraft } from '../../../shared/models/product-draft';
import { MerchantProduct } from '../models/merchant-product';
import { MerchantProductCatalog } from '../models/merchant-product-catalog';
import { MerchantProductQuery } from '../models/merchant-product-query';

export abstract class MerchantProductRepository {
  abstract getCatalog(): Observable<MerchantProductCatalog>;
  /** The products that match the page's search and sort. */
  abstract getProducts(query: MerchantProductQuery): Observable<readonly MerchantProduct[]>;
  abstract createProduct(draft: ProductDraft): Observable<MerchantProduct>;
  abstract updateProduct(id: string, draft: ProductDraft): Observable<MerchantProduct>;
  abstract deleteProduct(id: string): Observable<void>;
}
