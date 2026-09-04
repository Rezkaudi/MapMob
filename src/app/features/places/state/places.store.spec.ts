import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PlaceRepository } from '../data/place.repository';
import { PlacesStore } from './places.store';

const PLACE = {
  id: 'place-1',
  name: 'صيدلية الحياة',
  category: 'صيدلية',
  city: 'الرياض',
  rating: 4.9,
  status: 'active' as const,
  joinedAt: '2024-01-12T00:00:00.000Z',
};

function createStore(repository: Partial<PlaceRepository>) {
  TestBed.configureTestingModule({
    providers: [PlacesStore, { provide: PlaceRepository, useValue: repository }],
  });
  return TestBed.inject(PlacesStore);
}

describe('PlacesStore', () => {
  it('loads places and the total count', () => {
    const store = createStore({ getPlaces: () => of({ items: [PLACE], totalCount: 1 }) });

    store.loadPlaces();

    expect(store.places()).toEqual([PLACE]);
    expect(store.totalCount()).toBe(1);
  });

  it('reports no results when the loaded list is empty and not loading', () => {
    const store = createStore({ getPlaces: () => of({ items: [], totalCount: 0 }) });

    store.loadPlaces();

    expect(store.hasNoResults()).toBe(true);
  });

  it('setStatusFilter resets to the first page and reloads with the filter', () => {
    let requestedStatus: string | undefined;
    const store = createStore({
      getPlaces: (query) => {
        requestedStatus = query.status;
        return of({ items: [], totalCount: 0 });
      },
    });

    store.setStatusFilter('pending');

    expect(requestedStatus).toBe('pending');
    expect(store.pageIndex()).toBe(0);
  });
});
