import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { DeliveryPlatformRepository } from '../data/delivery-platform.repository';
import { LinkedStore } from '../models/linked-store';
import { buildDeliveryPlatform, buildLinkedStore } from '../testing/delivery-platform-fixture';
import { LinkedStoresStore } from './linked-stores.store';

const TALABAT = buildDeliveryPlatform({ id: '3' });
const CITY = buildLinkedStore({ id: 'place-1', name: 'مطعم المدينة' });
const CORNER = buildLinkedStore({
  id: 'place-2',
  name: 'مقهى الزاوية',
  category: { id: 'category-2', name: 'مقاهي' },
});

function createStore(getLinkedStores: DeliveryPlatformRepository['getLinkedStores']) {
  TestBed.configureTestingModule({
    providers: [
      LinkedStoresStore,
      { provide: DeliveryPlatformRepository, useValue: { getLinkedStores } },
    ],
  });
  return TestBed.inject(LinkedStoresStore);
}

describe('LinkedStoresStore', () => {
  it('opens on one platform and loads its stores', () => {
    const requested: string[] = [];
    const store = createStore((id) => {
      requested.push(id);
      return of([CITY, CORNER]);
    });

    store.open(TALABAT);

    expect(requested).toEqual(['3']);
    expect(store.platform()).toEqual(TALABAT);
    expect(store.rows().map((row) => row.store.id)).toEqual(['place-1', 'place-2']);
    expect(store.categoryOptions()).toHaveLength(2);
  });

  it('shows a loading table until the stores arrive', () => {
    const response = new Subject<readonly LinkedStore[]>();
    const store = createStore(() => response);

    store.open(TALABAT);
    expect(store.isLoading()).toBe(true);
    response.next([CITY]);

    expect(store.isLoading()).toBe(false);
  });

  it('filters by search and category without asking the server again', () => {
    let requestCount = 0;
    const store = createStore(() => {
      requestCount++;
      return of([CITY, CORNER]);
    });
    store.open(TALABAT);

    store.setCategory('category-2');
    expect(store.rows().map((row) => row.store.id)).toEqual(['place-2']);
    store.setSearch('المدينة');

    expect(store.rows()).toEqual([]);
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة لبحثك');
    expect(requestCount).toBe(1);
  });

  it('says when a platform has no linked stores yet', () => {
    const store = createStore(() => of([]));

    store.open(TALABAT);

    expect(store.emptyMessage()).toBe('لا توجد متاجر مرتبطة بهذه المنصة بعد');
  });

  it('keeps the reason the stores could not load', () => {
    const store = createStore(() => throwError(() => new Error('تعذر التحميل')));

    store.open(TALABAT);

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('forgets the platform and the filters when closed', () => {
    const store = createStore(() => of([CITY]));
    store.open(TALABAT);
    store.setSearch('x');

    store.close();

    expect(store.platform()).toBeNull();
    expect(store.search()).toBe('');
    expect(store.rows()).toEqual([]);
  });
});
