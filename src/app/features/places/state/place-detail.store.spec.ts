import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PlaceRepository } from '../data/place.repository';
import { createPlaceDetail } from '../testing/place-detail-fixture';
import { PlaceDetailStore } from './place-detail.store';

function createStore(repository: Partial<PlaceRepository>) {
  TestBed.configureTestingModule({
    providers: [PlaceDetailStore, { provide: PlaceRepository, useValue: repository }],
  });
  return TestBed.inject(PlaceDetailStore);
}

describe('PlaceDetailStore', () => {
  it('loads the place behind the given id', () => {
    const detail = createPlaceDetail();
    const store = createStore({ getPlace: () => of(detail) });

    store.loadPlace('place-1');

    expect(store.place()).toEqual(detail);
  });

  it('keeps the error message when the load fails', () => {
    const store = createStore({ getPlace: () => throwError(() => new Error('تعذر التحميل')) });

    store.loadPlace('place-1');

    expect(store.error()).toBe('تعذر التحميل');
  });
});

describe('PlaceDetailStore writes', () => {
  it('changes the status, then reloads the place', async () => {
    let loadCount = 0;
    let saved = '';
    const store = createStore({
      getPlace: () => {
        loadCount += 1;
        return of(createPlaceDetail({ status: 'suspended' }));
      },
      setPlacesStatus: (ids, status) => {
        saved = `${ids.join(',')}|${status}`;
        return of(undefined);
      },
    });
    store.loadPlace('place-1');

    expect(await store.changeStatus('place-1', 'suspended')).toBe(true);

    expect(saved).toBe('place-1|suspended');
    expect(loadCount).toBe(2);
  });

  it('keeps the failure message when the delete fails', async () => {
    const store = createStore({
      getPlace: () => of(createPlaceDetail()),
      deletePlaces: () => throwError(() => new Error('تعذر الحذف')),
    });

    expect(await store.deletePlace('place-1')).toBe(false);
    expect(store.saveError()).toBe('تعذر الحذف');
  });
});
