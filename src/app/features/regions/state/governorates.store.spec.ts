import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GovernorateRepository } from '../data/governorate.repository';
import { GovernorateQuery } from '../models/governorate-query';
import { buildGovernorate } from '../testing/region-entry-fixture';
import { GovernoratesStore } from './governorates.store';

const TARTUS = buildGovernorate();
const DRAFT = { name: 'حماة', status: 'active' as const };

function createStore(overrides: Partial<GovernorateRepository> = {}) {
  const queries: GovernorateQuery[] = [];
  const repository: Partial<GovernorateRepository> = {
    getGovernorates: (query) => {
      queries.push(query);
      return of({ items: [TARTUS], totalCount: 1 });
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [GovernoratesStore, { provide: GovernorateRepository, useValue: repository }],
  });
  return { store: TestBed.inject(GovernoratesStore), queries };
}

describe('GovernoratesStore', () => {
  it('loads a page of governorates', () => {
    const { store } = createStore();

    store.loadGovernorates();

    expect(store.entries()).toEqual([TARTUS]);
    expect(store.totalCount()).toBe(1);
    expect(store.isLoading()).toBe(false);
  });

  it('keeps the error when the page cannot load', () => {
    const { store } = createStore({
      getGovernorates: () => throwError(() => new Error('تعذر التحميل')),
    });

    store.loadGovernorates();

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('reloads from the first page when the search or sort changes', () => {
    const { store, queries } = createStore();

    store.setSearch('حمص');
    store.setSort('oldest');

    expect(queries.at(-1)).toEqual({ pageIndex: 0, pageSize: 5, search: 'حمص', sort: 'oldest' });
  });

  it('loads the page that was picked', () => {
    const { store, queries } = createStore({
      getGovernorates: (query) => {
        queries.push(query);
        return of({ items: [TARTUS], totalCount: 20 });
      },
    });
    store.loadGovernorates();

    store.changePage(2);

    expect(queries.at(-1)?.pageIndex).toBe(2);
  });

  it('creates a governorate and reloads the table', async () => {
    const createGovernorate = vi.fn(() => of(buildGovernorate({ name: 'حماة' })));
    const { store, queries } = createStore({ createGovernorate });

    const isSaved = await store.createGovernorate(DRAFT);

    expect(isSaved).toBe(true);
    expect(createGovernorate).toHaveBeenCalledWith(DRAFT);
    expect(queries).toHaveLength(1);
  });

  it('updates a governorate', async () => {
    const updateGovernorate = vi.fn(() => of(TARTUS));
    const { store } = createStore({ updateGovernorate });

    expect(await store.updateGovernorate('governorate-1', DRAFT)).toBe(true);
    expect(updateGovernorate).toHaveBeenCalledWith('governorate-1', DRAFT);
  });

  it('changes the status of a governorate', async () => {
    const setGovernorateStatus = vi.fn(() => of(TARTUS));
    const { store } = createStore({ setGovernorateStatus });

    expect(await store.changeStatus('governorate-1', 'suspended')).toBe(true);
    expect(setGovernorateStatus).toHaveBeenCalledWith('governorate-1', 'suspended');
  });

  it('deletes a governorate and drops its tick', async () => {
    const deleteGovernorate = vi.fn(() => of(undefined));
    const { store } = createStore({ deleteGovernorate });
    store.loadGovernorates();
    store.toggleSelected(TARTUS.id);

    expect(await store.deleteGovernorate(TARTUS.id)).toBe(true);
    expect(deleteGovernorate).toHaveBeenCalledWith(TARTUS.id);
    expect(store.isSelected(TARTUS.id)).toBe(false);
  });

  it('keeps the page and the tick when a delete fails', async () => {
    const { store } = createStore({
      getGovernorates: () => of({ items: [TARTUS], totalCount: 6 }),
      deleteGovernorate: () => throwError(() => new Error('تعذر الحذف')),
    });
    store.loadGovernorates();
    store.changePage(1);
    store.toggleSelected(TARTUS.id);

    expect(await store.deleteGovernorate(TARTUS.id)).toBe(false);
    expect(store.pageIndex()).toBe(1);
    expect(store.isSelected(TARTUS.id)).toBe(true);
  });

  it('keeps the table as it is when a save fails', async () => {
    const { store, queries } = createStore({
      createGovernorate: () => throwError(() => new Error('الاسم مستخدم')),
    });

    expect(await store.createGovernorate(DRAFT)).toBe(false);
    expect(store.saveError()).toBe('الاسم مستخدم');
    expect(queries).toHaveLength(0);
  });
});
