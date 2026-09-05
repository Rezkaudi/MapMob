import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PlaceRepository } from '../data/place.repository';
import { createPlace } from '../testing/place-fixture';
import { PlacesStore } from './places.store';

const PLACE = createPlace();
const EMPTY_COUNTS = { all: 0, active: 0, pending: 0, suspended: 0 };

function createStore(repository: Partial<PlaceRepository>) {
  TestBed.configureTestingModule({
    providers: [
      PlacesStore,
      {
        provide: PlaceRepository,
        useValue: { getStatusCounts: () => of(EMPTY_COUNTS), ...repository },
      },
    ],
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

  it('passes the category, package and sort filters to the repository', () => {
    const seen: string[] = [];
    const store = createStore({
      getPlaces: (query) => {
        seen.push(`${query.category}|${query.package}|${query.sort}`);
        return of({ items: [], totalCount: 0 });
      },
    });

    store.setCategoryFilter('مطعم');
    store.setPackageFilter('premium');
    store.setSort('rating');

    expect(seen.at(-1)).toBe('مطعم|premium|rating');
  });

  it('loads the status counts behind the chips', () => {
    const store = createStore({
      getPlaces: () => of({ items: [], totalCount: 0 }),
      getStatusCounts: () => of({ all: 120, active: 90, pending: 10, suspended: 20 }),
    });

    store.loadStatusCounts();

    expect(store.statusCounts().all).toBe(120);
    expect(store.statusCounts().active).toBe(90);
  });

  it('tracks how many rows are selected', () => {
    const store = createStore({
      getPlaces: () => of({ items: [PLACE, createPlace({ id: 'place-2' })], totalCount: 2 }),
    });
    store.loadPlaces();

    store.toggleSelected('place-1');

    expect(store.selectedCount()).toBe(1);
    expect(store.hasSelection()).toBe(true);
    expect(store.areAllVisibleSelected()).toBe(false);
  });

  it('toggleAllVisible selects every loaded row, then clears them', () => {
    const store = createStore({
      getPlaces: () => of({ items: [PLACE, createPlace({ id: 'place-2' })], totalCount: 2 }),
    });
    store.loadPlaces();

    store.toggleAllVisible();
    expect(store.areAllVisibleSelected()).toBe(true);

    store.toggleAllVisible();
    expect(store.selectedCount()).toBe(0);
  });

  it('drops the selection when the filter changes', () => {
    const store = createStore({ getPlaces: () => of({ items: [PLACE], totalCount: 1 }) });
    store.loadPlaces();
    store.toggleSelected('place-1');

    store.setStatusFilter('active');

    expect(store.selectedCount()).toBe(0);
  });
});
