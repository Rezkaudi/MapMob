import { buildLinkedStore } from '../testing/delivery-platform-fixture';
import { filterLinkedStores, listStoreCategories } from './linked-store-filter';

const CITY = buildLinkedStore({ id: 'place-1', name: 'مطعم المدينة' });
const CORNER = buildLinkedStore({
  id: 'place-2',
  name: 'مقهى الزاوية',
  category: { id: 'category-2', name: 'مقاهي' },
  governorate: { id: 'governorate-3', name: 'اللاذقية' },
  area: null,
});
const STORES = [CITY, CORNER];

describe('filterLinkedStores', () => {
  it('keeps every store with no search or category', () => {
    expect(filterLinkedStores(STORES, { search: '  ', categoryId: null })).toEqual(STORES);
  });

  it('matches the store name, the governorate or the area', () => {
    expect(filterLinkedStores(STORES, { search: 'الزاوية', categoryId: null })).toEqual([CORNER]);
    expect(filterLinkedStores(STORES, { search: 'اللاذقية', categoryId: null })).toEqual([CORNER]);
    expect(filterLinkedStores(STORES, { search: 'الدريكيش', categoryId: null })).toEqual([CITY]);
  });

  it('keeps one category only', () => {
    expect(filterLinkedStores(STORES, { search: '', categoryId: 'category-2' })).toEqual([CORNER]);
  });
});

describe('listStoreCategories', () => {
  it('lists each category once, by name', () => {
    expect(listStoreCategories([CITY, CORNER, CITY])).toEqual([
      { value: 'category-1', label: 'مطاعم' },
      { value: 'category-2', label: 'مقاهي' },
    ]);
  });
});
