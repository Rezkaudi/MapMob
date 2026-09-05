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
