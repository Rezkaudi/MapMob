import { ProductDraft } from '../../../shared/models/product-draft';
import { MerchantProduct } from '../models/merchant-product';
import { MerchantProductCatalog } from '../models/merchant-product-catalog';
import { describeProductQuota } from '../state/product-quota';
import { buildMerchantProductSeed } from './merchant-product-mock-seed';

const LIMIT_REACHED_MESSAGE = 'وصلت للحد المتاح في باقتك الحالية.';

/** The in-memory products behind the mock repository, loaded on first use. */
export class MerchantProductMockDatabase {
  private catalog: MerchantProductCatalog;
  private nextIdNumber = 1;

  constructor(private readonly now: () => Date) {
    this.catalog = buildMerchantProductSeed(now());
  }

  readCatalog(): MerchantProductCatalog {
    return this.catalog;
  }

  create(draft: ProductDraft): MerchantProduct {
    if (describeProductQuota(this.catalog.items.length, this.catalog.productLimit).isFull) {
      throw new Error(LIMIT_REACHED_MESSAGE);
    }
    const product = this.toProduct(`new-product-${this.nextIdNumber++}`, draft);
    this.catalog = { ...this.catalog, items: [...this.catalog.items, product] };
    return product;
  }

  update(id: string, draft: ProductDraft): MerchantProduct {
    const product = this.toProduct(id, draft);
    this.catalog = {
      ...this.catalog,
      items: this.catalog.items.map((item) => (item.id === id ? product : item)),
    };
    return product;
  }

  remove(id: string): void {
    this.catalog = { ...this.catalog, items: this.catalog.items.filter((item) => item.id !== id) };
  }

  private toProduct(id: string, draft: ProductDraft): MerchantProduct {
    return {
      id,
      name: draft.name,
      price: draft.price,
      currency: draft.currency,
      imageUrl: draft.imageUrl || null,
      isAvailable: draft.isAvailable,
      orderUrl: draft.orderUrl || null,
      updatedAt: this.now().toISOString(),
    };
  }
}
