import { ListSort } from '../../../shared/models/list-sort';
import { MerchantProduct } from '../models/merchant-product';

type ProductComparer = (first: MerchantProduct, second: MerchantProduct) => number;

const byUpdatedAt: ProductComparer = (first, second) =>
  first.updatedAt.localeCompare(second.updatedAt);

const PRODUCT_COMPARERS: Record<ListSort, ProductComparer> = {
  newest: (first, second) => byUpdatedAt(second, first),
  oldest: byUpdatedAt,
  name: (first, second) => first.name.localeCompare(second.name, 'ar'),
};

/** A place has a few dozen products at most, so the page searches and sorts them itself. */
export function filterProducts(
  products: readonly MerchantProduct[],
  search: string,
  sort: ListSort | null,
): readonly MerchantProduct[] {
  const term = search.trim().toLocaleLowerCase();
  const matching = term
    ? products.filter((product) => product.name.toLocaleLowerCase().includes(term))
    : products;
  return sort ? [...matching].sort(PRODUCT_COMPARERS[sort]) : matching;
}
