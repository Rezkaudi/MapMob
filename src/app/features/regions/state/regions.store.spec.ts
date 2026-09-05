import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RegionRepository } from '../data/region.repository';
import { RegionsStore } from './regions.store';

const REGION = {
  id: 'region-1',
  name: 'طرطوس',
  districtCount: 5,
  placeCount: 1200,
  status: 'active' as const,
  updatedAt: '2024-01-12T00:00:00.000Z',
};

function createStore(repository: Partial<RegionRepository>) {
  TestBed.configureTestingModule({
    providers: [RegionsStore, { provide: RegionRepository, useValue: repository }],
  });
  return TestBed.inject(RegionsStore);
}

describe('RegionsStore', () => {
  it('loads regions and the total count', () => {
    const store = createStore({ getRegions: () => of({ items: [REGION], totalCount: 1 }) });

    store.loadRegions();

    expect(store.regions()).toEqual([REGION]);
    expect(store.totalCount()).toBe(1);
    expect(store.isLoading()).toBe(false);
  });

  it('setSearch resets to the first page and reloads', () => {
    let requestedSearch: string | undefined;
    const store = createStore({
      getRegions: (query) => {
        requestedSearch = query.search;
        return of({ items: [], totalCount: 0 });
      },
    });

    store.setSearch('حمص');

    expect(requestedSearch).toBe('حمص');
    expect(store.pageIndex()).toBe(0);
  });
  it('reports no results only once the load has finished', () => {
    const store = createStore({ getRegions: () => of({ items: [], totalCount: 0 }) });

    store.loadRegions();

    expect(store.hasNoResults()).toBe(true);
  });
});
