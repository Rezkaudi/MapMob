import { Observable } from 'rxjs';
import { ProductDraft } from '../../../shared/models/product-draft';
import { MerchantProduct } from '../models/merchant-product';
import { MerchantProductCatalog } from '../models/merchant-product-catalog';

export abstract class MerchantProductRepository {
  abstract getCatalog(): Observable<MerchantProductCatalog>;
  abstract createProduct(draft: ProductDraft): Observable<MerchantProduct>;
  abstract updateProduct(id: string, draft: ProductDraft): Observable<MerchantProduct>;
  abstract deleteProduct(id: string): Observable<void>;
}
