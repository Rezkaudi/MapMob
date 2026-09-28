import { buildMerchantProduct } from '../testing/merchant-product-fixture';
import { filterProducts } from './filter-products';

const cream = buildMerchantProduct({
  id: 'a',
  name: 'مرطب dove',
  updatedAt: '2026-09-01T00:00:00Z',
});
const serum = buildMerchantProduct({ id: 'b', name: 'سيروم', updatedAt: '2026-09-20T00:00:00Z' });
const facial = buildMerchantProduct({
  id: 'c',
  name: 'تنظيف بشرة',
  updatedAt: '2026-09-10T00:00:00Z',
});
const products = [cream, serum, facial];

function ids(list: readonly { id: string }[]): string[] {
  return list.map((product) => product.id);
}

describe('filterProducts', () => {
  it('keeps the server order when there is no search and no sort', () => {
    expect(ids(filterProducts(products, '', null))).toEqual(['a', 'b', 'c']);
  });

  it('matches part of a name, ignoring case and outer spaces', () => {
    expect(ids(filterProducts(products, '  DOVE ', null))).toEqual(['a']);
    expect(ids(filterProducts(products, 'بشرة', null))).toEqual(['c']);
  });

  it('sorts by the last change, newest or oldest first', () => {
    expect(ids(filterProducts(products, '', 'newest'))).toEqual(['b', 'c', 'a']);
    expect(ids(filterProducts(products, '', 'oldest'))).toEqual(['a', 'c', 'b']);
  });

  it('sorts by name in Arabic order', () => {
    expect(ids(filterProducts(products, '', 'name'))).toEqual(['c', 'b', 'a']);
  });
});
