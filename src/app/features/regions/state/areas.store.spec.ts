import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AreaRepository } from '../data/area.repository';
import { GovernorateRepository } from '../data/governorate.repository';
import { AreaQuery } from '../models/area-query';
import { buildArea, buildGovernorate } from '../testing/region-entry-fixture';
import { AreasStore } from './areas.store';

const TARTUS = buildGovernorate({ id: 'governorate-1', name: 'طرطوس' });
const SAFITA = buildArea({ id: 'area-1', name: 'صافيتا' });
const DRAFT = { name: 'بانياس', status: 'active' as const };

function createStore(
  areaOverrides: Partial<AreaRepository> = {},
  governorateOverrides: Partial<GovernorateRepository> = {},
) {
  const queries: AreaQuery[] = [];
  const areaRepository: Partial<AreaRepository> = {
    getAreas: (query) => {
      queries.push(query);
      return of({ items: [SAFITA], totalCount: 1 });
    },
    ...areaOverrides,
  };
  const governorateRepository: Partial<GovernorateRepository> = {
    getGovernorate: () => of(TARTUS),
    ...governorateOverrides,
  };
  TestBed.configureTestingModule({
    providers: [
      AreasStore,
      { provide: AreaRepository, useValue: areaRepository },
      { provide: GovernorateRepository, useValue: governorateRepository },
    ],
  });
  return { store: TestBed.inject(AreasStore), queries };
}

describe('AreasStore', () => {
  it('opens a governorate: loads its name and the first page of its areas', () => {
    const { store, queries } = createStore();

    store.openGovernorate('governorate-1');

    expect(store.governorateName()).toBe('طرطوس');
    expect(store.entries()).toEqual([SAFITA]);
    expect(queries).toEqual([{ governorateId: 'governorate-1', pageIndex: 0, pageSize: 5 }]);
  });

  it('starts fresh when another governorate is opened', () => {
    const { store, queries } = createStore();
    store.openGovernorate('governorate-1');
    store.setSearch('صا');
    store.toggleSelected(SAFITA.id);

    store.openGovernorate('governorate-2');

    expect(store.search()).toBe('');
    expect(store.selectedIds()).toEqual([]);
    expect(queries.at(-1)).toEqual({ governorateId: 'governorate-2', pageIndex: 0, pageSize: 5 });
  });

  it('keeps the error when the governorate cannot load', () => {
    const { store } = createStore(
      {},
      { getGovernorate: () => throwError(() => new Error('لم يتم العثور على المحافظة')) },
    );

    store.openGovernorate('missing');

    expect(store.error()).toBe('لم يتم العثور على المحافظة');
  });

  it('keeps the error when the areas cannot load', () => {
    const { store } = createStore({ getAreas: () => throwError(() => new Error('تعذر التحميل')) });

    store.openGovernorate('governorate-1');

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('searches, sorts and pages inside the open governorate', () => {
    const { store, queries } = createStore({
      getAreas: (query) => {
        queries.push(query);
        return of({ items: [SAFITA], totalCount: 20 });
      },
    });
    store.openGovernorate('governorate-1');

    store.setSearch('صا');
    store.setSort('name');
    store.changePage(1);

    expect(queries.at(-1)).toEqual({
      governorateId: 'governorate-1',
      pageIndex: 1,
      pageSize: 5,
      search: 'صا',
      sort: 'name',
    });
  });

  it('creates an area inside the open governorate and reloads', async () => {
    const createArea = vi.fn(() => of(SAFITA));
    const { store, queries } = createStore({ createArea });
    store.openGovernorate('governorate-1');

    expect(await store.createArea(DRAFT)).toBe(true);
    expect(createArea).toHaveBeenCalledWith('governorate-1', DRAFT);
    expect(queries).toHaveLength(2);
  });

  it('updates, changes the status of and deletes an area', async () => {
    const updateArea = vi.fn(() => of(SAFITA));
    const setAreaStatus = vi.fn(() => of(SAFITA));
    const deleteArea = vi.fn(() => of(undefined));
    const { store } = createStore({ updateArea, setAreaStatus, deleteArea });
    store.openGovernorate('governorate-1');
    store.toggleSelected(SAFITA.id);

    expect(await store.updateArea(SAFITA.id, DRAFT)).toBe(true);
    expect(await store.changeStatus(SAFITA.id, 'suspended')).toBe(true);
    expect(await store.deleteArea(SAFITA.id)).toBe(true);

    expect(updateArea).toHaveBeenCalledWith(SAFITA.id, DRAFT);
    expect(setAreaStatus).toHaveBeenCalledWith(SAFITA.id, 'suspended');
    expect(deleteArea).toHaveBeenCalledWith(SAFITA.id);
    expect(store.isSelected(SAFITA.id)).toBe(false);
  });
});
